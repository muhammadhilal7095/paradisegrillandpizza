// @ts-check
/**
 * Runs once a card payment is confirmed: creates the order on the POS dashboard (sent to the kitchen and
 * marked paid by card), then sends the WhatsApp alert. Runs from the confirmation page and from Stripe's
 * webhook; progress is stored on the Stripe session, so each payment makes its orders once.
 *
 * The portal allows one deal per order, so the first deal joins the normal items and each further deal
 * gets its own order. PHP twin for static hosting: public/pay-api/fulfil.php. Keep the two in step.
 */

const MAX_CHUNKS = 30;
const CHUNK = 480;
const money = (/** @type {number} */ p) => `£${(p / 100).toFixed(2)}`;
const short = (/** @type {unknown} */ e) => (e instanceof Error ? e.message : String(e)).slice(0, 160);

/**
 * The order's POS details as Stripe metadata values (each is limited to 500 characters).
 * @param {Array<Record<string, any>>} lines priced cart lines with qty
 */
export function posMetadata(lines) {
  const spec = { r: /** @type {unknown[]} */ ([]), d: /** @type {unknown[]} */ ([]) };
  for (const l of lines) {
    if (l.posDeal) for (let n = 0; n < l.qty; n++) spec.d.push(l.posDeal);
    else spec.r.push({ ...l.posLine, q: l.qty });
  }
  const json = JSON.stringify(spec);
  /** @type {Record<string, string>} */
  const out = {};
  if (json.length > CHUNK * MAX_CHUNKS) return out; // Too big to store: the alert then says to enter it by hand.
  for (let i = 0; i * CHUNK < json.length; i++) out[`pos_${i}`] = json.slice(i * CHUNK, (i + 1) * CHUNK);
  return out;
}

/** @param {Record<string, string>} m */
function readSpec(m) {
  let json = "";
  for (let i = 0; m[`pos_${i}`] !== undefined; i++) json += m[`pos_${i}`];
  return json ? JSON.parse(json) : null;
}

const toPosItem = (/** @type {Record<string, any>} */ x) => ({
  product_id: x.p,
  quantity: x.q,
  variant_id: x.v ?? null,
  addons: (x.a ?? []).map((/** @type {any[]} */ a) => ({ addon_id: a[0], addon_name: a[1], addon_price: a[2], quantity: 1 })),
});

/**
 * One request body per POS order.
 * @param {Record<string, any>} spec @param {Record<string, string>} m session metadata
 */
export function buildOrders(spec, m) {
  const deals = spec.d ?? [];
  const regular = (spec.r ?? []).map(toPosItem);
  const groups = [];
  if (regular.length || deals.length) groups.push({ items: regular, deal: deals[0] ?? null });
  for (const deal of deals.slice(1)) groups.push({ items: [], deal });

  return groups.map(({ items, deal }, i) => {
    const allItems = [...items, ...(deal ? deal.i.map(toPosItem) : [])];
    const part = groups.length > 1 ? ` Part ${i + 1} of ${groups.length}.` : "";
    const note = `WEBSITE ORDER - PAID BY CARD.${part}${m.notes ? ` Customer note: ${m.notes}` : ""}`;
    /** @type {Record<string, any>} */
    const body = {
      order_type: m.fulfilment === "delivery" ? "delivery" : "takeaway",
      items: allItems.map((item, n) => (n === 0 ? { ...item, special_instructions: note } : item)),
      fire_kot: true,
      customer_name: m.customer_name,
      customer_phone: m.customer_phone || null,
    };
    if (m.fulfilment === "delivery" && m.address) body.delivery_address = m.address;
    if (deal) {
      body.deal_id = deal.d;
      if (deal.s?.length) body.deal_selections = deal.s.map((/** @type {Record<string, any>} */ s) => ({ deal_item_id: s.i, product_id: s.p, variant_id: s.v ?? null, quantity: s.q }));
    }
    return body;
  });
}

/**
 * @param {{ stripe: (path: string, method: "GET" | "POST", body?: URLSearchParams) => Promise<Record<string, any>>; formEncode: (o: Record<string, any>) => URLSearchParams; posBase: string; email: string; password: string; notifier: { enabled: boolean; send: (t: string) => Promise<boolean> } }} deps
 */
export function createFulfilment({ stripe, formEncode, posBase, email, password, notifier }) {
  /** Sessions being handled right now: a second caller waits for the first. @type {Map<string, Promise<boolean>>} */
  const running = new Map();

  /** @param {string} path @param {"GET" | "POST"} method @param {unknown} [body] @param {string} [token] */
  async function pos(path, method, body, token) {
    /** @type {Record<string, string>} */
    const headers = { Accept: "application/json", "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${posBase}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(20_000) });
    const data = /** @type {Record<string, any>} */ (await res.json().catch(() => ({})));
    if (!res.ok) throw new Error(`POS ${path.replace(/\d+/g, "#")} ${res.status}: ${String(data.message ?? "failed")}`);
    return data;
  }

  /** @param {string} id @param {Record<string, string>} changes */
  const mark = (id, changes) => stripe(`/checkout/sessions/${id}`, "POST", formEncode({ metadata: changes }));

  /**
   * Creates and pays the POS orders that aren't done yet.
   * @param {Record<string, any>} s @returns {Promise<{ ok: boolean; ids: string[]; error?: string; dashboardTotal?: number }>}
   */
  async function sendToPos(s) {
    const m = s.metadata ?? {};
    const ids = String(m.pos_orders ?? "").split(",").filter(Boolean);
    if (m.pos_done === "1") return { ok: true, ids };
    try {
      if (!email || !password) throw new Error("POS order login isn't set up");
      const spec = readSpec(m);
      if (!spec) throw new Error("order details weren't stored on the payment");
      const orders = buildOrders(spec, m);
      const login = await pos("/auth/login", "POST", { email, password });
      const token = String(login.token ?? "");
      if (!token) throw new Error("POS login returned no token");

      for (let i = ids.length; i < orders.length; i++) {
        const created = await pos("/orders", "POST", orders[i], token);
        const orderId = String(created.order?.id ?? "");
        if (!orderId) throw new Error("POS didn't return an order id");
        ids.push(orderId);
        await mark(s.id, { pos_orders: ids.join(",") });
      }

      let dashboardTotal = 0;
      for (const id of ids) {
        const { order } = await pos(`/orders/${id}`, "GET", undefined, token);
        dashboardTotal += Math.round(Number(order?.grand_total ?? 0) * 100);
        if (order?.payment_status === "paid") continue;
        await pos(`/orders/${id}/payment`, "POST", { payments: [{ method: "card", amount: Number(order?.grand_total ?? 0) }] }, token);
      }
      await mark(s.id, { pos_done: "1" });
      return { ok: true, ids, dashboardTotal };
    } catch (error) {
      console.error("[pos-order]", short(error));
      return { ok: false, ids, error: short(error) };
    }
  }

  /** @param {Record<string, any>} s @param {Awaited<ReturnType<typeof sendToPos>>} result */
  async function alert(s, result) {
    const m = s.metadata ?? {};
    if (!notifier.enabled || m.whatsapp_notified === "1") return;
    const ref = String(s.payment_intent ?? "").slice(-8).toUpperCase() || String(s.id).slice(-8).toUpperCase();
    const lines = [
      "NEW PAID WEBSITE ORDER",
      `Ref: ${ref}`,
      `Type: ${m.fulfilment === "delivery" ? "DELIVERY" : "COLLECTION"}`,
      result.ok ? `Dashboard: ADDED (order ${result.ids.join(", ")})` : "Dashboard: NOT ADDED - PLEASE ENTER THIS ORDER BY HAND",
      "",
      ...(s.line_items?.data ?? []).map((/** @type {Record<string, any>} */ li) => `${li.quantity} x ${String(li.description ?? "")} - ${money(li.amount_total)}`),
      "",
      `TOTAL PAID: ${money(s.amount_total)} (card)`,
      "",
      `Name: ${m.customer_name || "-"}`,
      `Phone: ${m.customer_phone || "-"}`,
    ];
    if (result.ok && result.dashboardTotal && result.dashboardTotal !== s.amount_total) lines.splice(4, 0, `Dashboard total: ${money(result.dashboardTotal)} (card paid ${money(s.amount_total)}, which includes fees)`);
    if (m.customer_email) lines.push(`Email: ${m.customer_email}`);
    if (m.fulfilment === "delivery") lines.push(`Address: ${m.address || "-"}`);
    if (m.notes) lines.push(`Notes: ${m.notes}`);
    if (await notifier.send(lines.join("\n"))) await mark(s.id, { whatsapp_notified: "1" }).catch((error) => console.error("[whatsapp-notify]", short(error)));
  }

  /** @param {string} id */
  async function run(id) {
    const s = await stripe(`/checkout/sessions/${id}?expand[]=line_items`, "GET");
    if (s.payment_status !== "paid") return true;
    const result = await sendToPos(s);
    await alert(s, result).catch((error) => console.error("[whatsapp-notify]", short(error)));
    return result.ok;
  }

  return {
    /**
     * @param {string} id Stripe Checkout Session id
     * @returns {Promise<boolean>} true when the POS has the order
     */
    async fulfil(id) {
      const busy = running.get(id);
      if (busy) await busy.catch(() => false);
      const job = run(id).finally(() => running.delete(id));
      running.set(id, job);
      return job;
    },
  };
}
