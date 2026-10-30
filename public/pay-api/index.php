<?php
/**
 * Card payments with Stripe Checkout, PHP version for static hosting (e.g. Hostinger web hosting,
 * where the Node server in server/payments.js doesn't run). Same routes and answers as the Node version:
 *
 *   GET  /pay-api/status            → { enabled }
 *   POST /pay-api/checkout          → { url }  (redirect the customer there)
 *   GET  /pay-api/session?id=cs_…   → { paid, … } for the confirmation page
 *   POST /pay-api/cash-order        → { reference, total }  (cash on delivery: no Stripe, goes straight to the POS and WhatsApp)
 *   POST /pay-api/webhook           ← Stripe's "payment finished" message
 *
 * The root .htaccess sends those addresses here. The secret key comes from config.php, which
 * scripts/write-pay-config.mjs writes into dist/ at build time from the host's environment variables;
 * visitors can't open it (.htaccess denies it, and running it prints nothing).
 *
 * Prices are NEVER taken from the browser: every item is re-priced from the POS, exactly as in
 * server/payments.js. Keep the two files in step.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

define('PAY_API', true);

const MAX_LINES = 50;
const MAX_QTY = 50;

$configFile = __DIR__ . '/config.php';
$config = is_file($configFile) ? require $configFile : array();
if (!is_array($config)) $config = array();
$stripeKey = trim((string) ($config['stripe_key'] ?? ''));
$posBase = rtrim(trim((string) ($config['pos_base'] ?? '')), '/');
$delivery = is_array($config['delivery'] ?? null) ? $config['delivery'] : array();
$enabled = $stripeKey !== '' && $posBase !== '';
/** Overridable for local testing against a fake Stripe; production always uses the real API. */
$stripeApi = getenv('STRIPE_API_BASE') ?: 'https://api.stripe.com/v1';

function send($status, $body)
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

class PayError extends Exception
{
}

function str($v)
{
    if (is_string($v)) return trim($v);
    if (is_int($v) || is_float($v)) return (string) $v;
    return '';
}

/** Pounds (6.99 / "6.99") → pence, or null. */
function to_pence($v)
{
    if ($v === null || $v === '') return null;
    $s = str_replace(array('£', ',', ' '), '', str($v));
    if ($s === '' || !is_numeric($s)) return null;
    $n = (float) $s;
    return $n >= 0 ? (int) round($n * 100) : null;
}

function is_off($v)
{
    return $v === false || $v === 0 || $v === '0' || (bool) preg_match('/^(false|no|inactive|disabled|unavailable|hidden)$/i', str($v));
}

function on($v)
{
    return $v === null || !is_off($v);
}

function clip($s, $n = 500)
{
    $len = function_exists('mb_strlen') ? mb_strlen($s) : strlen($s);
    if ($len <= $n) return $s;
    return (function_exists('mb_substr') ? mb_substr($s, 0, $n - 1) : substr($s, 0, $n - 1)) . '…';
}

function money($p)
{
    return '£' . number_format($p / 100, 2, '.', '');
}

/** Drops empty values so Stripe gets the same form fields as the Node version. */
function clean($a)
{
    $out = array();
    foreach ($a as $k => $v) {
        if (is_array($v)) {
            $v = clean($v);
            if ($v) $out[$k] = $v;
        } elseif ($v !== null && $v !== '') {
            $out[$k] = $v;
        }
    }
    return $out;
}

/** @return array{0:int,1:string} */
function http($method, $url, $headers = array(), $body = null, $timeout = 20)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => 10,
    ));
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $res = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($res === false) throw new PayError('HTTP request failed: ' . $err);
    return array($status, (string) $res);
}

function stripe($path, $method, $params = null)
{
    global $stripeKey, $stripeApi;
    list($status, $body) = http($method, $stripeApi . $path, array(
        'Authorization: Bearer ' . $stripeKey,
        'Content-Type: application/x-www-form-urlencoded',
        'Stripe-Version: 2024-06-20',
    ), $params === null ? null : http_build_query(clean($params), '', '&'));
    $data = json_decode($body, true);
    if (!is_array($data)) $data = array();
    if ($status < 200 || $status >= 300) throw new PayError('Stripe ' . $status . ': ' . ($data['error']['message'] ?? 'request failed'));
    return $data;
}

function pos_get($pathAndQuery)
{
    global $posBase;
    return http('GET', $posBase . $pathAndQuery, array('Accept: application/json'), null, 15);
}

/** Every product the POS lists, keyed by POS id. */
function load_products()
{
    $byId = array();
    $path = '/products?per_page=100';
    for ($page = 0; $path !== '' && $page < 20; $page++) {
        list($status, $body) = pos_get($path);
        if ($status === 401 || $status === 403) throw new PayError('menu-locked', 503);
        if ($status < 200 || $status >= 300) throw new PayError('POS products ' . $status);
        $data = json_decode($body, true);
        if (!is_array($data)) throw new PayError('POS products: bad JSON');
        $list = $data['products']['data'] ?? $data['data'] ?? $data['products'] ?? $data;
        foreach (is_array($list) ? $list : array() as $p) {
            if (is_array($p)) $byId[str($p['id'] ?? '')] = $p;
        }
        $next = str($data['products']['next_page_url'] ?? $data['next_page_url'] ?? $data['links']['next'] ?? '');
        $query = $next !== '' ? parse_url($next, PHP_URL_QUERY) : '';
        $path = $query ? '/products?' . $query : '';
    }
    return $byId;
}

/** Live special deals from the POS, keyed by id. */
function load_deals()
{
    list($status, $body) = pos_get('/mobile/deals');
    if ($status < 200 || $status >= 300) throw new PayError('POS deals ' . $status);
    $data = json_decode($body, true);
    $list = is_array($data) ? ($data['items'] ?? $data['data'] ?? $data) : array();
    $byId = array();
    foreach (is_array($list) ? $list : array() as $d) {
        if (is_array($d)) $byId[str($d['id'] ?? '')] = $d;
    }
    return $byId;
}

function first_sel($selections, $key)
{
    $v = $selections[$key] ?? null;
    return is_array($v) && isset($v[0]) ? str($v[0]) : '';
}

function https_image($url)
{
    $u = str($url);
    return preg_match('/^https:\/\//', $u) ? $u : null;
}

/** A special deal: fixed deal_price, valid only when live and every slot has a valid choice (and flavour where offered). */
function price_deal($d, $selections)
{
    $price = to_pence($d['deal_price'] ?? null);
    if (!$price || !on($d['is_active'] ?? null)) return null;
    $today = gmdate('Y-m-d');
    $start = substr(str($d['starts_at'] ?? ''), 0, 10);
    $end = substr(str($d['ends_at'] ?? ''), 0, 10);
    if (($start !== '' && $start > $today) || ($end !== '' && $end < $today)) return null;
    $products = array();
    foreach (is_array($d['products'] ?? null) ? $d['products'] : array() as $p) $products[str($p['id'] ?? '')] = $p;
    $labels = array();
    // Lines and picks in the portal's format, stored on the payment and sent to the POS once paid.
    $posItems = array();
    $posSelections = array();
    foreach (is_array($d['items'] ?? null) ? $d['items'] : array() as $slot) {
        $slotId = str($slot['id'] ?? '');
        $choice = null;
        foreach (is_array($slot['choices'] ?? null) ? $slot['choices'] : array() as $c) {
            if (str($c['id'] ?? '') === first_sel($selections, $slotId) && first_sel($selections, $slotId) !== '') {
                $choice = $c;
                break;
            }
        }
        if (!$choice) return null;
        $p = $choice['product'] ?? ($products[str($choice['product_id'] ?? '')] ?? array());
        $variant = $choice['variant'] ?? null;
        if (!$variant) {
            foreach (is_array($p['variants'] ?? null) ? $p['variants'] : array() as $v) {
                if (str($v['id'] ?? '') === str($choice['variant_id'] ?? '')) {
                    $variant = $v;
                    break;
                }
            }
        }
        $allowed = array_map('str', is_array($slot['allowed_addon_ids'] ?? null) ? $slot['allowed_addon_ids'] : array());
        $addons = array_values(array_filter(is_array($p['addons'] ?? null) ? $p['addons'] : array(), function ($a) use ($allowed) {
            return in_array(str($a['id'] ?? ''), $allowed, true) && on($a['is_available'] ?? null);
        }));
        $addonId = first_sel($selections, $slotId . ':addon');
        $addon = null;
        foreach ($addons as $a) {
            if ($addonId !== '' && str($a['id'] ?? '') === $addonId) {
                $addon = $a;
                break;
            }
        }
        if ($addons && !$addon) return null;
        $qty = (int) ($slot['quantity'] ?? 1) > 1 ? ((int) $slot['quantity']) . ' x ' : '';
        $labels[] = $qty . str($p['name'] ?? '') . ($variant ? ' ' . preg_replace('/\s+/', ' ', str($variant['name'] ?? '')) : '') . ($addon ? ' - ' . str($addon['name'] ?? '') : '');
        $slotQty = max(1, (int) ($slot['quantity'] ?? 1));
        $variantId = $variant['id'] ?? ($choice['variant_id'] ?? null);
        $productId = $choice['product_id'] ?? ($p['id'] ?? null);
        $posItems[] = array('p' => $productId, 'q' => $slotQty, 'v' => $variantId, 'a' => $addon ? array(array($addon['id'] ?? null, str($addon['name'] ?? ''), (float) ($addon['price'] ?? 0))) : array());
        $posSelections[] = array('i' => $slot['id'] ?? null, 'p' => $productId, 'v' => $variantId, 'q' => $slotQty);
    }
    return array('name' => str($d['title'] ?? ''), 'unit' => $price, 'labels' => $labels, 'image' => https_image($d['banner_url'] ?? ''), 'posDeal' => array('d' => $d['id'] ?? null, 'i' => $posItems, 's' => $posSelections));
}

/** One cart line from POS data: discounted current_price, chosen (or default) variant, add-ons. */
function price_line($p, $selections)
{
    $name = str($p['name'] ?? '');
    $base = to_pence($p['price'] ?? null);
    if ($name === '' || $base === null || !on($p['is_active'] ?? null) || !on($p['is_available'] ?? ($p['available'] ?? null))) return null;
    if (str($p['currency'] ?? '') !== '' && strtoupper(str($p['currency'])) !== 'GBP') return null;
    $current = to_pence($p['current_price'] ?? null);
    $unit = ($current !== null && $current < $base && ($p['has_active_discount'] ?? null) !== false) ? $current : $base;
    $labels = array();
    $variantId = null;
    $posAddons = array();

    $variants = array_values(array_filter(is_array($p['variants'] ?? null) ? $p['variants'] : array(), function ($v) {
        return str($v['name'] ?? '') !== '' && on($v['is_available'] ?? null);
    }));
    if (count($variants) > 1) {
        // Default variant first (stable, like the browser's sort).
        $indexed = array();
        foreach ($variants as $i => $v) $indexed[] = array($i, $v);
        usort($indexed, function ($a, $b) {
            $d = (int) !empty($b[1]['is_default']) - (int) !empty($a[1]['is_default']);
            return $d !== 0 ? $d : $a[0] - $b[0];
        });
        $variants = array_map(function ($x) {
            return $x[1];
        }, $indexed);
        $chosenId = first_sel($selections, 'variant');
        $chosen = $variants[0];
        foreach ($variants as $i => $v) {
            $vid = str($v['id'] ?? '') !== '' ? str($v['id']) : 'v' . $i;
            if ($vid === $chosenId) {
                $chosen = $v;
                break;
            }
        }
        $unit += to_pence($chosen['price_adjustment'] ?? null) ?? 0;
        $labels[] = str($chosen['name'] ?? '');
        $variantId = $chosen['id'] ?? null;
    } elseif (count($variants) === 1) {
        // Only one size: its price is part of the item's price.
        $unit += to_pence($variants[0]['price_adjustment'] ?? null) ?? 0;
        $variantId = $variants[0]['id'] ?? null;
    }
    $addons = array_values(array_filter(is_array($p['addons'] ?? null) ? $p['addons'] : array(), function ($a) {
        return str($a['name'] ?? '') !== '' && on($a['is_available'] ?? null);
    }));
    $picked = is_array($selections['addons'] ?? null) ? array_map('str', $selections['addons']) : array();
    foreach ($addons as $i => $a) {
        $aid = str($a['id'] ?? '') !== '' ? str($a['id']) : 'a' . $i;
        if (!in_array($aid, $picked, true)) continue;
        $unit += to_pence($a['price'] ?? null) ?? 0;
        $labels[] = str($a['name'] ?? '');
        $posAddons[] = array($a['id'] ?? null, str($a['name'] ?? ''), (float) ($a['price'] ?? 0));
    }
    return array('name' => $name, 'unit' => $unit, 'labels' => $labels, 'image' => https_image($p['image_url'] ?? ''), 'posLine' => array('p' => $p['id'] ?? null, 'v' => $variantId, 'a' => $posAddons));
}

function site_origin()
{
    global $config;
    $site = trim((string) ($config['site_url'] ?? ''));
    if ($site !== '') return (preg_match('/^https?:\/\//i', $site) ? '' : 'https://') . rtrim($site, '/');
    $host = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? ($_SERVER['HTTP_HOST'] ?? 'localhost');
    $proto = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? (preg_match('/^(localhost|127\.)/', $host) ? 'http' : 'https');
    return $proto . '://' . $host;
}

function line_label($l)
{
    return $l['name'] . ($l['labels'] ? ' (' . implode(', ', $l['labels']) . ')' : '');
}

/** The order's POS details as Stripe metadata values (each is limited to 500 characters). */
function pos_metadata($lines)
{
    $spec = array('r' => array(), 'd' => array());
    foreach ($lines as $l) {
        if (!empty($l['posDeal'])) {
            for ($n = 0; $n < $l['qty']; $n++) $spec['d'][] = $l['posDeal'];
        } else {
            $spec['r'][] = array_merge($l['posLine'], array('q' => $l['qty']));
        }
    }
    $chunks = str_split(json_encode($spec, JSON_UNESCAPED_SLASHES), 480);
    $out = array();
    if (count($chunks) > 30) return $out; // Too big to store: the alert then says to enter it by hand.
    foreach ($chunks as $i => $chunk) $out['pos_' . $i] = $chunk;
    return $out;
}

/** Checks a Stripe webhook's signature (t=…,v1=…), allowing five minutes of clock difference. */
function valid_stripe_signature($raw, $header, $secret)
{
    if ($secret === '' || $header === '') return false;
    $t = '';
    $given = array();
    foreach (explode(',', $header) as $part) {
        $kv = explode('=', $part, 2);
        if (count($kv) !== 2) continue;
        if ($kv[0] === 't') $t = $kv[1];
        if ($kv[0] === 'v1') $given[] = $kv[1];
    }
    if ($t === '' || abs(time() - (int) $t) > 300) return false;
    $expected = hash_hmac('sha256', $t . '.' . $raw, $secret);
    foreach ($given as $g) {
        if (hash_equals($expected, $g)) return true;
    }
    return false;
}

// ---------- Routing ----------

$path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$route = preg_match('#/pay-api/(status|checkout|session|webhook|cash-order)/?$#', $path, $mm) ? $mm[1] : '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($route === 'status' && $method === 'GET') send(200, array('enabled' => $enabled));
    if (!$enabled) send(503, array('message' => "Online payment isn't set up yet."));

    // ---- Start a payment ----
    if (($route === 'checkout' || $route === 'cash-order') && $method === 'POST') {
        $raw = (string) file_get_contents('php://input');
        if (strlen($raw) > 50000) send(413, array('message' => 'Order too large.'));
        $body = json_decode($raw !== '' ? $raw : '{}', true);
        if (!is_array($body)) send(400, array('message' => 'Please check your order details and try again.'));
        $items = is_array($body['items'] ?? null) ? array_slice($body['items'], 0, MAX_LINES) : array();
        $c = is_array($body['customer'] ?? null) ? $body['customer'] : array();
        $name = clip(str($c['name'] ?? ''), 80);
        $phone = clip(str($c['phone'] ?? ''), 30);
        $email = clip(str($c['email'] ?? ''), 120);
        $fulfilment = ($body['fulfilment'] ?? '') === 'delivery' ? 'delivery' : 'collection';
        $nameLen = function_exists('mb_strlen') ? mb_strlen($name) : strlen($name);
        if (!$items || $nameLen < 2 || strlen(preg_replace('/\D/', '', $phone)) < 10) send(400, array('message' => 'Please check your order details and try again.'));
        if ($fulfilment === 'delivery' && empty($delivery['deliveryEnabled'])) send(400, array('message' => "Delivery isn't available right now."));
        if ($fulfilment === 'collection' && empty($delivery['collectionEnabled'])) send(400, array('message' => "Collection isn't available right now."));

        $products = load_products();
        $deals = null;
        $lines = array();
        foreach ($items as $item) {
            if (!is_array($item)) send(400, array('message' => 'Please check your order details and try again.'));
            $productId = str($item['productId'] ?? '');
            $selections = is_array($item['selections'] ?? null) ? $item['selections'] : array();
            $qty = (int) floor((float) ($item['quantity'] ?? 0));
            if (strpos($productId, 'deal-') === 0) {
                if ($deals === null) $deals = load_deals();
                $deal = $deals[substr($productId, 5)] ?? null;
                $priced = $deal ? price_deal($deal, $selections) : null;
                if (!$priced || !($qty >= 1 && $qty <= MAX_QTY)) send(409, array('message' => 'A deal in your cart has changed or ended. Please remove it and add it again.'));
            } else {
                $p = $products[preg_replace('/^pos-/', '', $productId)] ?? null;
                $priced = $p ? price_line($p, $selections) : null;
                if (!$priced || !($qty >= 1 && $qty <= MAX_QTY)) send(409, array('message' => 'Something in your cart is no longer available. Please refresh your cart and try again.'));
            }
            $priced['qty'] = $qty;
            $lines[] = $priced;
        }

        $subtotal = 0;
        foreach ($lines as $l) $subtotal += $l['unit'] * $l['qty'];
        $deliveryFee = 0;
        if ($fulfilment === 'delivery') {
            $min = (int) ($delivery['minimumDeliveryOrder'] ?? 0);
            if ($subtotal < $min) send(400, array('message' => 'Delivery needs a minimum order of ' . money($min) . '.'));
            $free = $delivery['freeDeliveryFrom'] ?? null;
            $deliveryFee = ($free !== null && $subtotal >= (int) $free) ? 0 : (int) ($delivery['deliveryFee'] ?? 0);
        }
        $serviceFee = (int) ($delivery['serviceFee'] ?? 0);

        $address = $fulfilment === 'delivery' ? clip(str($body['address'] ?? '') . ', ' . strtoupper(str($body['postcode'] ?? '')), 300) : '';
        $summary = clip(implode('; ', array_map(function ($l) {
            return $l['qty'] . '× ' . line_label($l);
        }, $lines)));
        $metadata = array(
            'source' => 'website',
            'customer_name' => $name,
            'customer_phone' => $phone,
            'customer_email' => $email,
            'fulfilment' => $fulfilment,
            'address' => $address,
            'notes' => clip(str($body['notes'] ?? '')),
            'items' => $summary,
            'delivery_fee' => money($deliveryFee),
            'service_fee' => money($serviceFee),
        );
        $lineItems = array();
        foreach ($lines as $l) {
            $lineItems[] = array(
                'quantity' => $l['qty'],
                'price_data' => array(
                    'currency' => 'gbp',
                    'unit_amount' => $l['unit'],
                    'product_data' => array('name' => clip(line_label($l), 250), 'images' => $l['image'] ? array($l['image']) : null),
                ),
            );
        }
        if ($serviceFee) $lineItems[] = array('quantity' => 1, 'price_data' => array('currency' => 'gbp', 'unit_amount' => $serviceFee, 'product_data' => array('name' => 'Service fee')));
        if ($deliveryFee) $lineItems[] = array('quantity' => 1, 'price_data' => array('currency' => 'gbp', 'unit_amount' => $deliveryFee, 'product_data' => array('name' => 'Delivery')));

        if ($route === 'cash-order') {
            if ($fulfilment !== 'delivery') send(400, array('message' => 'Cash payment is only available for delivery.'));
            require_once __DIR__ . '/fulfil.php';
            $total = $subtotal + $deliveryFee + $serviceFee;
            $placed = place_cash_order(md5(json_encode(array($phone, $address, $items))), array_merge($metadata, array('payment' => 'cash')), pos_metadata($lines), $total, $lineItems);
            if (!$placed['ok']) send(502, array('message' => "We couldn't place your order. Nothing has been charged. Please call us or try again."));
            send(200, array('reference' => $placed['reference'], 'total' => $total));
        }

        $site = site_origin();
        $session = stripe('/checkout/sessions', 'POST', array(
            'mode' => 'payment',
            'submit_type' => 'pay',
            'locale' => 'en-GB',
            'line_items' => $lineItems,
            'customer_email' => preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email) ? $email : null,
            'success_url' => $site . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $site . '/checkout?payment=cancelled',
            'metadata' => array_merge($metadata, pos_metadata($lines)),
            'payment_intent_data' => array(
                'description' => clip('Website order (' . $fulfilment . ') for ' . $name . ': ' . $summary, 1000),
                'metadata' => $metadata,
            ),
        ));
        send(200, array('url' => $session['url'] ?? ''));
    }

    // ---- Stripe's own "payment finished" message, so the order arrives even if the customer closes the page ----
    if ($route === 'webhook' && $method === 'POST') {
        $raw = (string) file_get_contents('php://input');
        if (!valid_stripe_signature($raw, (string) ($_SERVER['HTTP_STRIPE_SIGNATURE'] ?? ''), trim((string) ($config['webhook_secret'] ?? '')))) send(400, array('message' => 'Bad signature.'));
        $event = json_decode($raw, true);
        $object = is_array($event['data']['object'] ?? null) ? $event['data']['object'] : array();
        $paidEvent = in_array($event['type'] ?? '', array('checkout.session.completed', 'checkout.session.async_payment_succeeded'), true);
        if ($paidEvent && ($object['payment_status'] ?? '') === 'paid') {
            require_once __DIR__ . '/fulfil.php';
            if (!fulfil_session(str($object['id'] ?? ''))) send(500, array('message' => 'Order not added to the POS yet.')); // Stripe tries again later.
        }
        send(200, array('received' => true));
    }

    // ---- Payment result, for the confirmation page ----
    if ($route === 'session' && $method === 'GET') {
        $id = (string) ($_GET['id'] ?? '');
        if (!preg_match('/^cs_(live|test)_[A-Za-z0-9]+$/', $id)) send(400, array('message' => 'Invalid payment reference.'));
        $s = stripe('/checkout/sessions/' . $id . '?expand%5B%5D=line_items', 'GET');
        $m = is_array($s['metadata'] ?? null) ? $s['metadata'] : array();
        $paid = ($s['payment_status'] ?? '') === 'paid';
        if ($paid) {
            try {
                require_once __DIR__ . '/fulfil.php';
                fulfil_session($id);
            } catch (Throwable $e) {
                error_log('[fulfil] ' . substr($e->getMessage(), 0, 160));
            }
        }
        $items = array();
        foreach ($s['line_items']['data'] ?? array() as $li) {
            $items[] = array('name' => str($li['description'] ?? ''), 'quantity' => $li['quantity'] ?? 1, 'amount' => $li['amount_total'] ?? 0);
        }
        send(200, array(
            'paid' => $paid,
            'status' => $s['status'] ?? null,
            'reference' => strtoupper(substr(str($s['payment_intent'] ?? ''), -8)) ?: strtoupper(substr($id, -8)),
            'total' => $s['amount_total'] ?? 0,
            'items' => $items,
            'customer' => array('name' => $m['customer_name'] ?? null, 'phone' => $m['customer_phone'] ?? null, 'email' => $m['customer_email'] ?? null),
            'fulfilment' => $m['fulfilment'] ?? null,
            'address' => $m['address'] ?? null,
            'notes' => $m['notes'] ?? null,
        ));
    }

    send(404, array('message' => 'Not found'));
} catch (Throwable $e) {
    if ($e->getCode() === 503) send(503, array('message' => "The menu couldn't be checked, so the payment wasn't started. Please try again shortly."));
    error_log('[payments] ' . $e->getMessage());
    send(502, array('message' => "We couldn't start the payment. You haven't been charged. Please try again."));
}
