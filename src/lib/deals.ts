/**
 * Special deals from the POS (GET {API}/mobile/deals, public), the "Deals" the restaurant creates in
 * the portal's Mobile App screen. A deal has a fixed price and one or more slots ("1 × Pizza"); the
 * customer picks one choice per slot (a product, maybe a size), plus a flavour where the portal allows it.
 *
 * Shape: { items: [{ id, title, description, banner_url, deal_price, discount_type, discount_value,
 *   is_active, starts_at, ends_at, sort_order,
 *   items: [{ id, name, quantity, allowed_addon_ids, choices: [{ id, product_id, variant_id, quantity, product, variant }] }] }] }
 */

import { useEffect, useState } from "react";
import { API_BASE_URL } from "./api";

type Raw = Record<string, any>;

export interface DealChoice {
  id: string;
  /** e.g. "Margherita Pizza (Small 9")" */
  label: string;
  imageUrl?: string;
  /** Flavours/extras the customer may pick for this choice (from the slot's allowed add-ons). */
  addons: { id: string; label: string }[];
}

export interface DealSlot {
  id: string;
  name: string;
  quantity: number;
  choices: DealChoice[];
}

export interface SpecialDeal {
  id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  /** Pence; null when the deal is a % / fixed discount without its own price. */
  price: number | null;
  /** "20% OFF" / "£2 OFF" when there is no fixed price. */
  badge?: string;
  endsAt?: string;
  slots: DealSlot[];
}

const BASE = (API_BASE_URL || "https://pos.paradisegap.co.uk/api").replace(/\/+$/, "");
const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const pence = (v: unknown) => {
  const n = Number(str(v));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
};
const on = (v: unknown) => !(v === false || v === 0 || v === "0");
const today = () => new Date().toISOString().slice(0, 10);

/** POS deal → site deal, or null when inactive, out of date or unorderable. */
export function toDeal(d: Raw): SpecialDeal | null {
  if (!on(d.is_active) || !str(d.title)) return null;
  const start = str(d.starts_at).slice(0, 10);
  const end = str(d.ends_at).slice(0, 10);
  if ((start && start > today()) || (end && end < today())) return null;

  const products = new Map<string, Raw>((Array.isArray(d.products) ? d.products : []).map((p: Raw) => [str(p.id), p]));
  const slots: DealSlot[] = (Array.isArray(d.items) ? d.items : [])
    .map((it: Raw) => {
      const allowed = new Set((Array.isArray(it.allowed_addon_ids) ? it.allowed_addon_ids : []).map(str));
      const choices: DealChoice[] = (Array.isArray(it.choices) ? it.choices : [])
        .map((c: Raw): DealChoice | null => {
          const p: Raw = c.product ?? products.get(str(c.product_id)) ?? {};
          if (!str(p.name) || !on(p.is_active ?? true) || !on(p.is_available ?? true)) return null;
          const variant: Raw | undefined = c.variant ?? (p.variants ?? []).find((v: Raw) => str(v.id) === str(c.variant_id));
          const variantName = str(variant?.name).replace(/\s+/g, " ");
          const qty = Number(c.quantity) > 1 ? `${Number(c.quantity)} × ` : "";
          const addons = (Array.isArray(p.addons) ? p.addons : [])
            .filter((a: Raw) => allowed.has(str(a.id)) && on(a.is_available ?? true))
            .map((a: Raw) => ({ id: str(a.id), label: str(a.name) }));
          return {
            id: str(c.id),
            label: `${qty}${str(p.name)}${variantName ? ` (${variantName})` : ""}`,
            imageUrl: str(p.image_url) || undefined,
            addons,
          };
        })
        .filter((c: DealChoice | null): c is DealChoice => c !== null);
      return { id: str(it.id), name: str(it.name) || "Choice", quantity: Math.max(1, Number(it.quantity) || 1), choices };
    })
    .filter((s: DealSlot) => s.choices.length > 0);

  const type = str(d.discount_type);
  const value = Number(str(d.discount_value)) || 0;
  const badge = type === "percentage" && value > 0 ? `${value}% OFF` : type === "fixed" && value > 0 ? `£${value.toFixed(2)} OFF` : undefined;

  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description) || undefined,
    bannerUrl: str(d.banner_url) || undefined,
    price: pence(d.deal_price),
    badge,
    endsAt: end || undefined,
    slots,
  };
}

let cache: Promise<SpecialDeal[]> | null = null;

/** Live deals, fetched once per page load. Errors give an empty list (the sections then hide). */
export function fetchDeals(): Promise<SpecialDeal[]> {
  cache ??= fetch(`${BASE}/mobile/deals`, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12000) })
    .then((r) => (r.ok ? r.json() : { items: [] }))
    .then((body: Raw) => {
      const list: Raw[] = Array.isArray(body?.items) ? body.items : Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
      return list
        .slice()
        .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
        .map(toDeal)
        .filter((d): d is SpecialDeal => d !== null);
    })
    .catch(() => {
      cache = null;
      return [];
    });
  return cache;
}

export function useDeals() {
  const [deals, setDeals] = useState<SpecialDeal[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    fetchDeals().then((d) => {
      if (!live) return;
      setDeals(d);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);
  return { deals, loading };
}

/** Cart line id for a deal with the chosen options (same choices = same line). */
export const dealLineId = (dealId: string, selections: Record<string, string[]>) =>
  `deal-${dealId}|${Object.keys(selections)
    .sort()
    .map((k) => `${k}=${[...selections[k]].sort().join("+")}`)
    .join("|")}`;
