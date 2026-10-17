/**
 * Ordering settings: collection/delivery, fees and the WhatsApp number.
 *
 * Fees and minimums live in delivery.json (shared with the payment server) and are SAMPLE values. Replace them with the restaurant's real
 * figures, then set ORDERING_SETTINGS_VERIFIED to true (until then checkout shows a
 * short "sample fees" note so nobody relies on them).
 *
 * Card payments go through Stripe Checkout (server/payments.js; STRIPE_SECRET_KEY on the server).
 * The site says "paid" only after the server confirms the payment with Stripe. WhatsApp orders are
 * confirmed by the restaurant replying, and VITE_ORDER_ENDPOINT orders only once that endpoint returns success.
 */

import DELIVERY from "./delivery.json";

export const ORDERING_SETTINGS_VERIFIED = false;

export const ORDERING = {
  /** Added to every order (collection and delivery), in pence. */
  serviceFee: DELIVERY.serviceFee,
  collection: { enabled: DELIVERY.collectionEnabled, label: "Collection", note: "Ready in about 20 minutes" },
  delivery: {
    enabled: DELIVERY.deliveryEnabled,
    label: "Delivery",
    note: "Usually 15–30 minutes",
    /** In pence. */
    fee: DELIVERY.deliveryFee,
    /** Subtotal (pence) needed before delivery can be chosen. */
    minimumOrder: DELIVERY.minimumDeliveryOrder,
    /** Subtotal (pence) from which delivery is free. null = never free. */
    freeFrom: DELIVERY.freeDeliveryFrom as number | null,
  },
};

export type Fulfilment = "collection" | "delivery";

/**
 * WhatsApp number in international format, digits only (e.g. 447700900123).
 * Set VITE_WHATSAPP_NUMBER in .env.local. While it's empty the WhatsApp button
 * explains that WhatsApp ordering isn't set up yet instead of opening a chat.
 */
export const WHATSAPP_NUMBER = ((import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "").replace(/\D/g, "");

/**
 * Optional online order endpoint (your own API / POS). It receives a POST with the order as JSON
 * and must answer 2xx with { reference?: string } once the order is really accepted.
 * Leave empty to offer WhatsApp ordering only.
 */
export const ORDER_ENDPOINT = ((import.meta.env.VITE_ORDER_ENDPOINT as string | undefined) ?? "").trim();
