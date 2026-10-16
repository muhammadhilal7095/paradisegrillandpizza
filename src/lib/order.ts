import { BRAND } from "../config/site";
import { ORDER_ENDPOINT, ORDERING, WHATSAPP_NUMBER, type Fulfilment } from "../config/ordering";
import type { CartItem } from "../context/CartContext";
import { formatPrice, formatShortPrice } from "../data/menu";

// ---------- Totals ----------

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** Pence still needed before delivery can be chosen (0 when it can). */
  deliveryShortfall: number;
}

export function orderTotals(subtotal: number, fulfilment: Fulfilment): OrderTotals {
  const { delivery } = ORDERING;
  const deliveryShortfall = Math.max(0, delivery.minimumOrder - subtotal);
  const free = delivery.freeFrom !== null && subtotal >= delivery.freeFrom;
  const deliveryFee = fulfilment === "delivery" && !free ? delivery.fee : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee, deliveryShortfall };
}

export const availableFulfilments = (): Fulfilment[] =>
  (["collection", "delivery"] as const).filter((f) => ORDERING[f].enabled);

// ---------- Checkout details ----------

export interface CheckoutDetails {
  name: string;
  phone: string;
  email: string;
  fulfilment: Fulfilment;
  address: string;
  postcode: string;
  notes: string;
  /** Guests only: optional password for the account created with the order. Never sent with the order. */
  password: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;

/** UK-friendly but lenient: 10–15 digits, optional leading +. */
const PHONE_RE = /^\+?[\d\s()-]{10,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Standard UK postcode shape (case-insensitive, optional space). */
const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

/** `guest`: not logged in, so an account is created with the order (email required, password optional). */
export function validateCheckout(d: CheckoutDetails, subtotal: number, { guest = false } = {}): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (d.name.trim().length < 2) errors.name = "Please enter your name.";
  const digits = d.phone.replace(/\D/g, "");
  if (!PHONE_RE.test(d.phone.trim()) || digits.length < 10 || digits.length > 15)
    errors.phone = "Please enter a valid phone number so we can contact you about your order.";
  if (guest && !d.email.trim()) errors.email = "Please enter your email. We'll use it to create your account.";
  else if (d.email.trim() && !EMAIL_RE.test(d.email.trim())) errors.email = "Please enter a valid email address, like name@example.com.";
  if (guest && d.password && d.password.length < 6) errors.password = "Use at least 6 characters, or leave it empty.";
  if (d.fulfilment === "delivery") {
    if (d.address.trim().length < 5) errors.address = "Please enter your delivery address.";
    if (!POSTCODE_RE.test(d.postcode.trim())) errors.postcode = "Please enter a valid UK postcode, e.g. SW1A 1AA.";
    const { deliveryShortfall } = orderTotals(subtotal, "delivery");
    if (deliveryShortfall > 0)
      errors.fulfilment = `Delivery needs a minimum order of ${formatShortPrice(ORDERING.delivery.minimumOrder)}. Add ${formatPrice(deliveryShortfall)} more, or choose collection.`;
  }
  if (d.notes.length > 500) errors.notes = "Please keep notes under 500 characters.";
  return errors;
}

// ---------- WhatsApp ----------

export const whatsappConfigured = WHATSAPP_NUMBER.length >= 10;

/** Plain-text order summary for WhatsApp. */
export function buildOrderMessage(items: CartItem[], totals: OrderTotals, details?: CheckoutDetails) {
  const lines = [`Hello ${BRAND.name}, I'd like to place an order:`, ""];
  for (const item of items) {
    lines.push(`${item.quantity} × ${item.name} – ${formatPrice(item.price * item.quantity)}`);
    if (item.options?.length) lines.push(`   (${item.options.join(", ")})`);
  }
  lines.push("", `Subtotal: ${formatPrice(totals.subtotal)}`);
  if (details?.fulfilment === "delivery") lines.push(`Delivery: ${totals.deliveryFee ? formatPrice(totals.deliveryFee) : "Free"}`);
  lines.push(`Total: ${formatPrice(totals.total)}`);

  if (details) {
    lines.push("", `Order type: ${ORDERING[details.fulfilment].label}`, `Name: ${details.name.trim()}`, `Phone: ${details.phone.trim()}`);
    if (details.email.trim()) lines.push(`Email: ${details.email.trim()}`);
    if (details.fulfilment === "delivery") lines.push(`Address: ${details.address.trim()}, ${details.postcode.trim().toUpperCase()}`);
    if (details.notes.trim()) lines.push(`Notes: ${details.notes.trim()}`);
  }
  lines.push("", "Please confirm my order and the total. Thank you!");
  return lines.join("\n");
}

export const whatsappUrl = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// ---------- Online order endpoint (optional) ----------

export const onlineOrderingConfigured = ORDER_ENDPOINT.length > 0;

export type SubmitResult = { ok: true; reference?: string } | { ok: false; message: string };

/** Sends the order to VITE_ORDER_ENDPOINT. Only a 2xx answer counts as accepted. */
export async function submitOrder(items: CartItem[], totals: OrderTotals, details: CheckoutDetails): Promise<SubmitResult> {
  if (!onlineOrderingConfigured) return { ok: false, message: "Online ordering isn't connected yet." };
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(ORDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        customer: { name: details.name.trim(), phone: details.phone.trim(), email: details.email.trim() || null },
        fulfilment: details.fulfilment,
        address: details.fulfilment === "delivery" ? { line: details.address.trim(), postcode: details.postcode.trim().toUpperCase() } : null,
        notes: details.notes.trim() || null,
        items: items.map((i) => ({ productId: i.productId, name: i.name, options: i.selections ?? {}, quantity: i.quantity, unitPrice: i.price })),
        totals,
        currency: "GBP",
      }),
    });
    if (!res.ok) return { ok: false, message: `The restaurant's ordering system didn't accept the order (error ${res.status}). Nothing has been charged. Please try again or order by WhatsApp.` };
    const data: unknown = await res.json().catch(() => ({}));
    const reference = typeof data === "object" && data && "reference" in data ? String((data as { reference: unknown }).reference) : undefined;
    return { ok: true, reference };
  } catch {
    return { ok: false, message: "We couldn't reach the ordering system. Check your connection and try again. Your order has not been placed." };
  } finally {
    window.clearTimeout(timer);
  }
}
