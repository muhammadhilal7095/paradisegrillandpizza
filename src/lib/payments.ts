/**
 * Card payments via Stripe Checkout, through the site's own server (server/payments.js).
 * The browser only sends what was ordered; the server prices it from the POS and talks to Stripe.
 */

import type { CartItem } from "../context/CartContext";
import { tokenStore } from "./api";
import type { CheckoutDetails } from "./order";

export interface PaymentResult {
  paid: boolean;
  status: string;
  reference: string;
  /** Pence. */
  total: number;
  items: { name: string; quantity: number; amount: number }[];
  customer: { name?: string; phone?: string; email?: string };
  fulfilment?: string;
  address?: string;
  notes?: string;
}

const json = { Accept: "application/json", "Content-Type": "application/json" };

/** True when the server has Stripe set up. */
export async function cardPaymentsEnabled(): Promise<boolean> {
  try {
    const res = await fetch("/pay-api/status", { headers: { Accept: "application/json" } });
    return res.ok && Boolean(((await res.json()) as { enabled?: boolean }).enabled);
  } catch {
    return false;
  }
}

/** Creates the Stripe payment and returns the URL to send the customer to, or an error message. */
export async function startCardPayment(items: CartItem[], details: CheckoutDetails): Promise<{ url: string } | { error: string }> {
  const headers: Record<string, string> = { ...json };
  // Lets the server read the menu with the customer's login if it has no account of its own.
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch("/pay-api/checkout", {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, selections: i.selections ?? {}, quantity: i.quantity })),
        customer: { name: details.name.trim(), phone: details.phone.trim(), email: details.email.trim() },
        fulfilment: details.fulfilment,
        address: details.address.trim(),
        postcode: details.postcode.trim(),
        notes: details.notes.trim(),
      }),
    });
    const body = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
    if (res.ok && body.url) return { url: body.url };
    return { error: body.message || "We couldn't start the payment. You haven't been charged. Please try again." };
  } catch {
    return { error: "We couldn't reach the payment service. Check your connection and try again. You haven't been charged." };
  }
}

/** The outcome of a Stripe Checkout session, checked on the server. */
export async function getPaymentResult(sessionId: string): Promise<PaymentResult | null> {
  try {
    const res = await fetch(`/pay-api/session?id=${encodeURIComponent(sessionId)}`, { headers: { Accept: "application/json" } });
    return res.ok ? ((await res.json()) as PaymentResult) : null;
  } catch {
    return null;
  }
}
