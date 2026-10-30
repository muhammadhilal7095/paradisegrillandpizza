<?php
/**
 * Runs once a card payment is confirmed: creates the order on the POS dashboard (sent to the kitchen and
 * marked paid by card), then sends the WhatsApp alert. Loaded by index.php from the confirmation page and
 * from Stripe's webhook; progress is stored on the Stripe session, so each payment makes its orders once.
 *
 * It lives in its own file so a problem here can never stop customers from paying. Twin of server/fulfil.js.
 */

if (!defined('PAY_API')) {
    http_response_code(404);
    exit;
}

function pos_order_call($path, $method, $body = null, $token = '')
{
    global $posBase;
    $headers = array('Accept: application/json', 'Content-Type: application/json');
    if ($token !== '') $headers[] = 'Authorization: Bearer ' . $token;
    list($status, $raw) = http($method, $posBase . $path, $headers, $body === null ? null : json_encode($body, JSON_UNESCAPED_SLASHES), 20);
    $data = json_decode($raw, true);
    if (!is_array($data)) $data = array();
    if ($status < 200 || $status >= 300) {
        throw new PayError('POS ' . preg_replace('/\d+/', '#', $path) . ' ' . $status . ': ' . str($data['message'] ?? 'failed'));
    }
    return $data;
}

function mark_session($id, $changes)
{
    stripe('/checkout/sessions/' . $id, 'POST', array('metadata' => $changes));
}

function read_pos_spec($m)
{
    $json = '';
    for ($i = 0; isset($m['pos_' . $i]); $i++) $json .= $m['pos_' . $i];
    if ($json === '') return null;
    $spec = json_decode($json, true);
    return is_array($spec) ? $spec : null;
}

function to_pos_item($x)
{
    $addons = array();
    foreach ($x['a'] ?? array() as $a) {
        $addons[] = array('addon_id' => $a[0], 'addon_name' => $a[1], 'addon_price' => $a[2], 'quantity' => 1);
    }
    return array('product_id' => $x['p'], 'quantity' => $x['q'], 'variant_id' => $x['v'] ?? null, 'addons' => $addons);
}

/** One request body per POS order: the first deal joins the normal items, each further deal gets its own order. */
function build_pos_orders($spec, $m)
{
    $deals = $spec['d'] ?? array();
    $regular = array_map('to_pos_item', $spec['r'] ?? array());
    $groups = array();
    if ($regular || $deals) $groups[] = array('items' => $regular, 'deal' => $deals[0] ?? null);
    foreach (array_slice($deals, 1) as $deal) $groups[] = array('items' => array(), 'deal' => $deal);

    $orders = array();
    foreach ($groups as $i => $g) {
        $deal = $g['deal'];
        $items = $g['items'];
        if ($deal) $items = array_merge($items, array_map('to_pos_item', $deal['i']));
        $part = count($groups) > 1 ? ' Part ' . ($i + 1) . ' of ' . count($groups) . '.' : '';
        $paying = ($m['payment'] ?? '') === 'cash' ? 'CASH ON DELIVERY - NOT PAID. COLLECT ' . ($m['cash_total'] ?? '') . ' FOR THE WHOLE ORDER.' : 'PAID BY CARD.';
        if ($items) $items[0]['special_instructions'] = 'WEBSITE ORDER - ' . $paying . $part . (!empty($m['notes']) ? ' Customer note: ' . $m['notes'] : '');
        $body = array(
            'order_type' => ($m['fulfilment'] ?? '') === 'delivery' ? 'delivery' : 'takeaway',
            'items' => $items,
            'fire_kot' => true,
            'customer_name' => $m['customer_name'] ?? '',
            'customer_phone' => ($m['customer_phone'] ?? '') !== '' ? $m['customer_phone'] : null,
        );
        if (($m['fulfilment'] ?? '') === 'delivery' && !empty($m['address'])) $body['delivery_address'] = $m['address'];
        if ($deal) {
            $body['deal_id'] = $deal['d'];
            $selections = array();
            foreach ($deal['s'] ?? array() as $s) {
                $selections[] = array('deal_item_id' => $s['i'], 'product_id' => $s['p'], 'variant_id' => $s['v'] ?? null, 'quantity' => $s['q']);
            }
            if ($selections) $body['deal_selections'] = $selections;
        }
        $orders[] = $body;
    }
    return $orders;
}

/** Creates and pays the POS orders that aren't done yet. */
function send_to_pos($s)
{
    global $config;
    $m = is_array($s['metadata'] ?? null) ? $s['metadata'] : array();
    $ids = array_values(array_filter(explode(',', (string) ($m['pos_orders'] ?? '')), 'strlen'));
    if (($m['pos_done'] ?? '') === '1') return array('ok' => true, 'ids' => $ids, 'total' => 0);
    try {
        $email = trim((string) ($config['order_email'] ?? ''));
        $password = (string) ($config['order_password'] ?? '');
        if ($email === '' || $password === '') throw new PayError("POS order login isn't set up");
        $spec = read_pos_spec($m);
        if (!$spec) throw new PayError("order details weren't stored on the payment");
        $orders = build_pos_orders($spec, $m);
        $login = pos_order_call('/auth/login', 'POST', array('email' => $email, 'password' => $password));
        $token = str($login['token'] ?? '');
        if ($token === '') throw new PayError('POS login returned no token');

        for ($i = count($ids); $i < count($orders); $i++) {
            $created = pos_order_call('/orders', 'POST', $orders[$i], $token);
            $orderId = str($created['order']['id'] ?? '');
            if ($orderId === '') throw new PayError("POS didn't return an order id");
            $ids[] = $orderId;
            mark_session($s['id'], array('pos_orders' => implode(',', $ids)));
        }

        $total = 0;
        foreach ($ids as $id) {
            $res = pos_order_call('/orders/' . $id, 'GET', null, $token);
            $order = is_array($res['order'] ?? null) ? $res['order'] : array();
            $grand = (float) ($order['grand_total'] ?? 0);
            $total += (int) round($grand * 100);
            if (($order['payment_status'] ?? '') === 'paid') continue;
            pos_order_call('/orders/' . $id . '/payment', 'POST', array('payments' => array(array('method' => 'card', 'amount' => $grand))), $token);
        }
        mark_session($s['id'], array('pos_done' => '1'));
        return array('ok' => true, 'ids' => $ids, 'total' => $total);
    } catch (Throwable $e) {
        error_log('[pos-order] ' . substr($e->getMessage(), 0, 160));
        return array('ok' => false, 'ids' => $ids, 'total' => 0);
    }
}

/** The WhatsApp message for an order. */
function alert_text($s, $result)
{
    $m = is_array($s['metadata'] ?? null) ? $s['metadata'] : array();
    $cash = ($m['payment'] ?? '') === 'cash';
    $ref = strtoupper(substr(str($s['payment_intent'] ?? ''), -8)) ?: strtoupper(substr(str($s['id'] ?? ''), -8));
    $lines = array(
        $cash ? 'NEW WEBSITE ORDER - CASH ON DELIVERY' : 'NEW PAID WEBSITE ORDER',
        'Ref: ' . $ref,
        'Type: ' . (($m['fulfilment'] ?? '') === 'delivery' ? 'DELIVERY' : 'COLLECTION'),
        $result['ok'] ? 'Dashboard: ADDED (order ' . implode(', ', $result['ids']) . ')' : 'Dashboard: NOT ADDED - PLEASE ENTER THIS ORDER BY HAND',
    );
    $paid = (int) ($s['amount_total'] ?? 0);
    if ($result['ok'] && $result['total'] && $result['total'] !== $paid) {
        $lines[] = 'Dashboard total: ' . money($result['total']) . ' (' . ($cash ? 'customer pays ' : 'card paid ') . money($paid) . ', which includes fees)';
    }
    $lines[] = '';
    foreach ($s['line_items']['data'] ?? array() as $li) {
        $lines[] = ($li['quantity'] ?? 1) . ' x ' . str($li['description'] ?? '') . ' - ' . money((int) ($li['amount_total'] ?? 0));
    }
    array_push($lines, '', $cash ? 'COLLECT IN CASH: ' . money($paid) : 'TOTAL PAID: ' . money($paid) . ' (card)', '', 'Name: ' . (($m['customer_name'] ?? '') ?: '-'), 'Phone: ' . (($m['customer_phone'] ?? '') ?: '-'));
    if (!empty($m['customer_email'])) $lines[] = 'Email: ' . $m['customer_email'];
    if (($m['fulfilment'] ?? '') === 'delivery') $lines[] = 'Address: ' . (($m['address'] ?? '') ?: '-');
    if (!empty($m['notes'])) $lines[] = 'Notes: ' . $m['notes'];
    return implode("\n", $lines);
}

/** Sends a message to the restaurant's WhatsApp (CallMeBot). @return bool true when the service accepted it */
function send_whatsapp($text)
{
    global $config;
    $phone = preg_replace('/\D/', '', (string) ($config['whatsapp_phone'] ?? ''));
    $key = trim((string) ($config['whatsapp_apikey'] ?? ''));
    if ($phone === '' || $key === '') return false;
    $url = 'https://api.callmebot.com/whatsapp.php?phone=' . $phone . '&text=' . rawurlencode($text) . '&apikey=' . rawurlencode($key);
    list($status, $body) = http('GET', $url, array(), null, 15);
    if ($status >= 200 && $status < 300 && !preg_match('/error|invalid|not.*(allowed|valid)/i', $body)) return true;
    error_log('[whatsapp-notify] not sent: ' . $status);
    return false;
}

/** Sends the paid order to the restaurant's WhatsApp, once per payment. */
function alert_whatsapp($s, $result)
{
    if ((($s['metadata']['whatsapp_notified'] ?? '') === '1')) return;
    if (send_whatsapp(alert_text($s, $result))) mark_session($s['id'], array('whatsapp_notified' => '1'));
}

/**
 * Places a cash on delivery order: POS order (not marked paid) and WhatsApp alert. No payment is involved,
 * so the same order repeated within two minutes is ignored. It only counts as placed if the restaurant
 * heard about it one way or the other.
 * @return array{ok:bool,reference:string}
 */
function place_cash_order($repeatKey, $metadata, $specChunks, $total, $lineItems)
{
    $file = sys_get_temp_dir() . '/paradise-cash-' . $repeatKey . '.json';
    $lock = @fopen($file . '.lock', 'c');
    if ($lock) flock($lock, LOCK_EX);
    try {
        if (is_file($file) && time() - (int) filemtime($file) < 120) {
            $seen = json_decode((string) file_get_contents($file), true);
            if (is_array($seen) && !empty($seen['ok'])) return $seen;
        }

        $m = array_merge($metadata, array('cash_total' => money($total)));
        $result = array('ok' => false, 'ids' => array(), 'total' => 0);
        try {
            global $config;
            $email = trim((string) ($config['order_email'] ?? ''));
            $password = (string) ($config['order_password'] ?? '');
            if ($email === '' || $password === '') throw new PayError("POS order login isn't set up");
            $spec = read_pos_spec($specChunks);
            if (!$spec) throw new PayError('order too large to send');
            $login = pos_order_call('/auth/login', 'POST', array('email' => $email, 'password' => $password));
            $token = str($login['token'] ?? '');
            if ($token === '') throw new PayError('POS login returned no token');
            foreach (build_pos_orders($spec, $m) as $body) {
                $created = pos_order_call('/orders', 'POST', $body, $token);
                $result['ids'][] = str($created['order']['id'] ?? '') ?: '?';
                $result['total'] += (int) round(((float) ($created['order']['grand_total'] ?? 0)) * 100);
            }
            $result['ok'] = true;
        } catch (Throwable $e) {
            error_log('[pos-order] ' . substr($e->getMessage(), 0, 160));
        }

        $reference = $result['ids'][0] ?? strtoupper(bin2hex(random_bytes(4)));
        $items = array();
        foreach ($lineItems as $l) {
            $items[] = array('quantity' => $l['quantity'], 'description' => $l['price_data']['product_data']['name'], 'amount_total' => $l['quantity'] * $l['price_data']['unit_amount']);
        }
        $sent = false;
        try {
            $sent = send_whatsapp(alert_text(array('id' => $reference, 'amount_total' => $total, 'metadata' => $m, 'line_items' => array('data' => $items)), $result));
        } catch (Throwable $e) {
            error_log('[whatsapp-notify] ' . substr($e->getMessage(), 0, 160));
        }

        $placed = array('ok' => $result['ok'] || count($result['ids']) > 0 || $sent, 'reference' => $reference);
        if ($placed['ok']) @file_put_contents($file, json_encode($placed));
        return $placed;
    } finally {
        if ($lock) {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }
}

/**
 * Does both jobs for a paid session. Only one request per payment at a time: the page and the webhook can
 * arrive together, so the second waits here and then sees what the first stored on the session.
 * @return bool true when the POS has the order
 */
function fulfil_session($id)
{
    $lock = @fopen(sys_get_temp_dir() . '/paradise-pay-' . md5($id) . '.lock', 'c');
    if ($lock) flock($lock, LOCK_EX);
    try {
        $s = stripe('/checkout/sessions/' . $id . '?expand%5B%5D=line_items', 'GET');
        if (($s['payment_status'] ?? '') !== 'paid') return true;
        $result = send_to_pos($s);
        try {
            alert_whatsapp($s, $result);
        } catch (Throwable $e) {
            error_log('[whatsapp-notify] ' . substr($e->getMessage(), 0, 160));
        }
        return $result['ok'];
    } finally {
        if ($lock) {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }
}
