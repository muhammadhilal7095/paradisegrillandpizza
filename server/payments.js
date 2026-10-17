// @ts-check
/**
 * Card payments with Stripe Checkout (Stripe's hosted payment page). Runs on the web server only:
 * the secret key (STRIPE_SECRET_KEY) never reaches the browser, and card details never touch this site.
 *
 *   GET  /pay-api/status            → { enabled }
 *   POST /pay-api/checkout          → { url }  (redirect the customer there)
 *   GET  /pay-api/session?id=cs_…   → { paid, … } for the confirmation page
 *
 * Prices are NEVER taken from the browser: every item is re-priced from the POS (price, discount,
 * variant and add-on prices) and the delivery fee comes from src/config/delivery.json.
 * The order details are stored as metadata on the Stripe payment, so they appear in the Stripe Dashboard.
 */

import { readFileSync } from "node:fs";
import { createWhatsAppNotifier } from "./notify.js";
import { createPosClient } from "./posClient.js";

const DELIVERY = JSON.parse(readFileSync(new URL("../src/config/delivery.json", import.meta.url), "utf8"));
/** Overridable for local testing against a fake Stripe; production always uses the real API. */
const STRIPE_API = process.env.STRIPE_API_BASE || "https://api.stripe.com/v1";
const MAX_LINES = 50;
const MAX_QTY = 50;

/** @typedef {Record<string, any>} Raw */

const str = (/** @type {unknown} */ v) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
/** Pounds (6.99 / "6.99") → pence, or null. */
const toPence = (/** @type {unknown} */ v) => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(str(v).replace(/[£,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
};
const isOff = (/** @type {unknown} */ v) => v === false || v === 0 || v === "0" || /^(false|no|inactive|disabled|unavailable|hidden)$/i.test(str(v));
const on = (/** @type {unknown} */ v) => v === undefined || v === null || !isOff(v);
const clip = (/** @type {string} */ s, n = 500) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const money = (/** @type {number} */ p) => `£${(p / 100).toFixed(2)}`;

/** Flattens nested params into Stripe's form encoding: a[b][0][c]=… */
function formEncode(/** @type {Raw} */ obj, prefix = "", out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") formEncode(v, key, out);
    else out.append(key, String(v));
  }
  return out;
}

/**
 * @param {{ stripeKey?: string; siteUrl?: string; pos: { baseUrl?: string; email?: string; password?: string }; whatsapp?: { phone?: string; apiKey?: string; baseUrl?: string } }} config
 * @returns {(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, next?: () => void) => Promise<void>}
 */
export function createPayments({ stripeKey = "", siteUrl = "", pos: posConfig, whatsapp = {} }) {
  const key = stripeKey.trim();
  const pos = createPosClient(posConfig);
  const enabled = Boolean(key && pos.configured);
  const notifier = createWhatsAppNotifier(whatsapp);
  /** Sessions whose alert is being sent right now (stops a double send if the page loads twice). */
  const sending = new Set();

  /**
   * Sends the paid order to the restaurant's WhatsApp, once per payment. The "sent" mark is stored
   * on the Stripe session itself, so it survives server restarts.
   * @param {Raw} s Stripe Checkout Session (with line_items)
   */
  async function notifyPaidOrder(s) {
    const m = s.metadata ?? {};
    if (!notifier.enabled || m.whatsapp_notified === "1" || sending.has(s.id)) return;
    sending.add(s.id);
    try {
      const ref = str(s.payment_intent).slice(-8).toUpperCase() || str(s.id).slice(-8).toUpperCase();
      const lines = [
        "NEW PAID WEBSITE ORDER",
        `Ref: ${ref}`,
        `Type: ${m.fulfilment === "delivery" ? "DELIVERY" : "COLLECTION"}`,
        "",
        ...(s.line_items?.data ?? []).map((/** @type {Raw} */ li) => `${li.quantity} x ${str(li.description)} - ${money(li.amount_total)}`),
        "",
        `TOTAL PAID: ${money(s.amount_total)} (card)`,
        "",
        `Name: ${m.customer_name || "-"}`,
        `Phone: ${m.customer_phone || "-"}`,
      ];
      if (m.customer_email) lines.push(`Email: ${m.customer_email}`);
      if (m.fulfilment === "delivery") lines.push(`Address: ${m.address || "-"}`);
      if (m.notes) lines.push(`Notes: ${m.notes}`);
      if (await notifier.send(lines.join("\n"))) {
        await stripe(`/checkout/sessions/${s.id}`, "POST", formEncode({ metadata: { whatsapp_notified: "1" } })).catch((error) =>
          console.error("[payments] couldn't mark WhatsApp as sent:", error instanceof Error ? error.message : error),
        );
      }
    } finally {
      sending.delete(s.id);
    }
  }

  /** @param {string} path @param {"GET" | "POST"} method @param {URLSearchParams} [body] */
  async function stripe(path, method, body) {
    const res = await fetch(`${STRIPE_API}${path}`, {
      method,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded", "Stripe-Version": "2024-06-20" },
      body,
      signal: AbortSignal.timeout(20_000),
    });
    const data = /** @type {Raw} */ (await res.json().catch(() => ({})));
    if (!res.ok) throw new Error(`Stripe ${res.status}: ${data.error?.message ?? "request failed"}`);
    return data;
  }

  /** Every product the POS lists, keyed by POS id. */
  async function loadProducts(/** @type {string | undefined} */ visitorAuth) {
    /** @type {Map<string, Raw>} */
    const byId = new Map();
    let path = "/products?per_page=100";
    for (let page = 0; path && page < 20; page++) {
      const { status, body } = await pos.get(path, visitorAuth);
      if (status === 401 || status === 403) throw Object.assign(new Error("menu-locked"), { code: 503 });
      if (status < 200 || status >= 300) throw new Error(`POS products ${status}`);
      const data = JSON.parse(body);
      const list = Array.isArray(data) ? data : data.products?.data ?? data.data ?? data.products ?? [];
      for (const p of Array.isArray(list) ? list : []) byId.set(str(p.id), p);
      const next = str(data.products?.next_page_url ?? data.next_page_url ?? data.links?.next);
      path = next ? `/products${new URL(next).search}` : "";
    }
    return byId;
  }

  /** Live special deals from the POS, keyed by id. */
  async function loadDeals() {
    /** @type {Map<string, Raw>} */
    const byId = new Map();
    const { status, body } = await pos.get("/mobile/deals");
    if (status < 200 || status >= 300) throw new Error(`POS deals ${status}`);
    const data = JSON.parse(body);
    const list = Array.isArray(data) ? data : data.items ?? data.data ?? [];
    for (const d of Array.isArray(list) ? list : []) byId.set(str(d.id), d);
    return byId;
  }

  /**
   * Prices a special deal: its fixed deal_price, valid only when it's live and every slot has a valid
   * choice (and an allowed flavour where the slot offers one).
   * @param {Raw} d @param {Record<string, string[]>} selections
   */
  function priceDeal(d, selections) {
    const price = toPence(d.deal_price);
    if (!price || !on(d.is_active)) return null;
    const today = new Date().toISOString().slice(0, 10);
    const start = str(d.starts_at).slice(0, 10);
    const end = str(d.ends_at).slice(0, 10);
    if ((start && start > today) || (end && end < today)) return null;
    const products = new Map((Array.isArray(d.products) ? d.products : []).map((/** @type {Raw} */ p) => [str(p.id), p]));
    const labels = [];
    for (const slot of Array.isArray(d.items) ? d.items : []) {
      const choice = (slot.choices ?? []).find((/** @type {Raw} */ c) => str(c.id) === selections[str(slot.id)]?.[0]);
      if (!choice) return null;
      const p = choice.product ?? products.get(str(choice.product_id)) ?? {};
      const variant = choice.variant ?? (p.variants ?? []).find((/** @type {Raw} */ v) => str(v.id) === str(choice.variant_id));
      const allowed = (slot.allowed_addon_ids ?? []).map(str);
      const addons = (p.addons ?? []).filter((/** @type {Raw} */ a) => allowed.includes(str(a.id)) && on(a.is_available));
      const addonId = selections[`${str(slot.id)}:addon`]?.[0];
      const addon = addons.find((/** @type {Raw} */ a) => str(a.id) === addonId);
      if (addons.length && !addon) return null;
      const qty = Number(slot.quantity) > 1 ? `${Number(slot.quantity)} x ` : "";
      labels.push(`${qty}${str(p.name)}${variant ? ` ${str(variant.name).replace(/\s+/g, " ")}` : ""}${addon ? ` - ${str(addon.name)}` : ""}`);
    }
    return { name: str(d.title), unit: price, labels, image: /^https:\/\//.test(str(d.banner_url)) ? str(d.banner_url) : undefined };
  }

  /**
   * Prices one cart line from POS data. Mirrors the site's mapping (src/lib/products.ts):
   * discounted current_price, the chosen (or default) variant's adjustment, and add-on prices.
   * @param {Raw} p @param {Record<string, string[]>} selections
   */
  function priceLine(p, selections) {
    const name = str(p.name);
    const base = toPence(p.price);
    if (!name || base === null || !on(p.is_active) || !on(p.is_available ?? p.available)) return null;
    if (str(p.currency) && str(p.currency).toUpperCase() !== "GBP") return null;
    const current = toPence(p.current_price);
    let unit = current !== null && current < base && p.has_active_discount !== false ? current : base;
    const labels = [];

    const variants = (Array.isArray(p.variants) ? p.variants : []).filter((/** @type {Raw} */ v) => str(v.name) && on(v.is_available));
    if (variants.length > 1) {
      variants.sort((/** @type {Raw} */ a, /** @type {Raw} */ b) => Number(Boolean(b.is_default)) - Number(Boolean(a.is_default)));
      const chosenId = selections.variant?.[0];
      const chosen = variants.find((/** @type {Raw} */ v, /** @type {number} */ i) => (str(v.id) || `v${i}`) === chosenId) ?? variants[0];
      unit += toPence(chosen.price_adjustment) ?? 0;
      labels.push(str(chosen.name));
    } else if (variants.length === 1) {
      // Only one size: its price is part of the item's price (the site shows it that way too).
      unit += toPence(variants[0].price_adjustment) ?? 0;
    }
    const addons = (Array.isArray(p.addons) ? p.addons : []).filter((/** @type {Raw} */ a) => str(a.name) && on(a.is_available));
    addons.forEach((/** @type {Raw} */ a, /** @type {number} */ i) => {
      if (!(selections.addons ?? []).includes(str(a.id) || `a${i}`)) return;
      unit += toPence(a.price) ?? 0;
      labels.push(str(a.name));
    });
    return { name, unit, labels, image: /^https:\/\//.test(str(p.image_url)) ? str(p.image_url) : undefined };
  }

  /** @param {import("node:http").IncomingMessage} req */
  function origin(req) {
    if (siteUrl) return siteUrl.replace(/\/+$/, "");
    const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";
    const proto = req.headers["x-forwarded-proto"] ?? (/^(localhost|127\.)/.test(String(host)) ? "http" : "https");
    return `${proto}://${host}`;
  }

  /** @param {import("node:http").IncomingMessage} req */
  async function readJson(req) {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 50_000) throw Object.assign(new Error("too large"), { code: 413 });
    }
    return JSON.parse(raw || "{}");
  }

  return async function payments(req, res, next) {
    const url = new URL(req.url ?? "/", "http://local");
    if (!url.pathname.startsWith("/pay-api/")) return next?.();
    const route = url.pathname.slice("/pay-api".length);
    /** @param {number} status @param {Raw} body */
    const send = (status, body) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(JSON.stringify(body));
    };

    try {
      if (route === "/status" && req.method === "GET") return send(200, { enabled });
      if (!enabled) return send(503, { message: "Online payment isn't set up yet." });

      // ---- Start a payment ----
      if (route === "/checkout" && req.method === "POST") {
        const body = await readJson(req);
        const items = Array.isArray(body.items) ? body.items.slice(0, MAX_LINES) : [];
        const c = body.customer ?? {};
        const name = clip(str(c.name), 80);
        const phone = clip(str(c.phone), 30);
        const email = clip(str(c.email), 120);
        const fulfilment = body.fulfilment === "delivery" ? "delivery" : "collection";
        if (!items.length || name.length < 2 || phone.replace(/\D/g, "").length < 10) return send(400, { message: "Please check your order details and try again." });
        if (fulfilment === "delivery" && !DELIVERY.deliveryEnabled) return send(400, { message: "Delivery isn't available right now." });
        if (fulfilment === "collection" && !DELIVERY.collectionEnabled) return send(400, { message: "Collection isn't available right now." });

        const products = await loadProducts(typeof req.headers.authorization === "string" ? req.headers.authorization : undefined);
        /** @type {Map<string, Raw> | null} */
        let deals = null;
        const lines = [];
        for (const item of items) {
          // Special deals (POS Mobile App deals): fixed deal price, every pick checked against the deal.
          if (str(item.productId).startsWith("deal-")) {
            deals ??= await loadDeals();
            const deal = deals.get(str(item.productId).slice(5));
            const priced = deal && priceDeal(deal, item.selections && typeof item.selections === "object" ? item.selections : {});
            const qty = Math.floor(Number(item.quantity));
            if (!priced || !(qty >= 1 && qty <= MAX_QTY)) return send(409, { message: "A deal in your cart has changed or ended. Please remove it and add it again." });
            lines.push({ ...priced, qty });
            continue;
          }
          const p = products.get(str(item.productId).replace(/^pos-/, ""));
          const priced = p && priceLine(p, item.selections && typeof item.selections === "object" ? item.selections : {});
          const qty = Math.floor(Number(item.quantity));
          if (!priced || !(qty >= 1 && qty <= MAX_QTY)) return send(409, { message: "Something in your cart is no longer available. Please refresh your cart and try again." });
          lines.push({ ...priced, qty });
        }

        const subtotal = lines.reduce((sum, l) => sum + l.unit * l.qty, 0);
        let deliveryFee = 0;
        if (fulfilment === "delivery") {
          if (subtotal < DELIVERY.minimumDeliveryOrder) return send(400, { message: `Delivery needs a minimum order of ${money(DELIVERY.minimumDeliveryOrder)}.` });
          deliveryFee = DELIVERY.freeDeliveryFrom !== null && subtotal >= DELIVERY.freeDeliveryFrom ? 0 : DELIVERY.deliveryFee;
        }

        const serviceFee = Number(DELIVERY.serviceFee) || 0;

        const address = fulfilment === "delivery" ? clip(`${str(body.address)}, ${str(body.postcode).toUpperCase()}`, 300) : "";
        const summary = clip(lines.map((l) => `${l.qty}× ${l.name}${l.labels.length ? ` (${l.labels.join(", ")})` : ""}`).join("; "));
        const metadata = {
          source: "website",
          customer_name: name,
          customer_phone: phone,
          customer_email: email,
          fulfilment,
          address,
          notes: clip(str(body.notes)),
          items: summary,
          delivery_fee: money(deliveryFee),
          service_fee: money(serviceFee),
        };
        const lineItems = lines.map((l) => ({
          quantity: l.qty,
          price_data: {
            currency: "gbp",
            unit_amount: l.unit,
            product_data: { name: clip(`${l.name}${l.labels.length ? ` (${l.labels.join(", ")})` : ""}`, 250), images: l.image ? [l.image] : undefined },
          },
        }));
        if (serviceFee) lineItems.push({ quantity: 1, price_data: { currency: "gbp", unit_amount: serviceFee, product_data: { name: "Service fee", images: undefined } } });
        if (deliveryFee) lineItems.push({ quantity: 1, price_data: { currency: "gbp", unit_amount: deliveryFee, product_data: { name: "Delivery", images: undefined } } });

        const site = origin(req);
        const session = await stripe(
          "/checkout/sessions",
          "POST",
          formEncode({
            mode: "payment",
            submit_type: "pay",
            locale: "en-GB",
            line_items: lineItems,
            customer_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
            success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${site}/checkout?payment=cancelled`,
            metadata,
            payment_intent_data: {
              description: clip(`Website order (${fulfilment}) for ${name}: ${summary}`, 1000),
              metadata,
            },
          }),
        );
        return send(200, { url: session.url });
      }

      // ---- Payment result, for the confirmation page ----
      if (route === "/session" && req.method === "GET") {
        const id = url.searchParams.get("id") ?? "";
        if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(id)) return send(400, { message: "Invalid payment reference." });
        const s = await stripe(`/checkout/sessions/${id}?expand[]=line_items`, "GET");
        const m = s.metadata ?? {};
        if (s.payment_status === "paid") await notifyPaidOrder(s);
        return send(200, {
          paid: s.payment_status === "paid",
          status: s.status,
          reference: str(s.payment_intent).slice(-8).toUpperCase() || id.slice(-8).toUpperCase(),
          total: s.amount_total,
          items: (s.line_items?.data ?? []).map((/** @type {Raw} */ li) => ({ name: str(li.description), quantity: li.quantity, amount: li.amount_total })),
          customer: { name: m.customer_name, phone: m.customer_phone, email: m.customer_email },
          fulfilment: m.fulfilment,
          address: m.address,
          notes: m.notes,
        });
      }

      send(404, { message: "Not found" });
    } catch (error) {
      const code = /** @type {any} */ (error)?.code;
      if (code === 413) return send(413, { message: "Order too large." });
      if (code === 503) return send(503, { message: "The menu couldn't be checked, so the payment wasn't started. Please try again shortly." });
      console.error("[payments]", error instanceof Error ? error.message : error);
      send(502, { message: "We couldn't start the payment. You haven't been charged. Please try again." });
    }
  };
}
