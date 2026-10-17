/**
 * Loads the menu from the POS API. This is the ONLY source of products and categories on the site.
 *
 * Live format (taken from the portal's own Menu Management screen):
 *   GET /products?page=1&per_page=…  → { products: { data: [...], next_page_url, … } }   (Laravel paginator)
 *   GET /categories                  → { categories: [ { id, name, image_url, is_active, … } ] }
 * A product has: id, name, short_description, category_id, category { name }, price, current_price,
 * has_active_discount, image (storage path) and image_url (full URL), is_active, is_available,
 * is_featured, variants [{ name, price_adjustment, is_default, is_available }] and
 * addons [{ name, price, is_available }]. Internal fields such as cost_price are never used.
 *
 * Requests go to the site's own /menu-api first (server/menuProxy.js: it logs in with a dedicated
 * account on the server, because the POS only shares products with logged-in accounts). If that isn't
 * set up, the POS is called directly with the visitor's own login, if any.
 *
 * The shorter shape in the API docs ({ data: [{ category: "Burgers", price, image }] }) is accepted too.
 * Each portal category becomes one menu section, named exactly as in the portal. Requests never log anyone out.
 */

import { makeCategory, stockPhotoFor, type MenuCategory, type OptionGroup, type Product } from "../data/menu";
import { API_BASE_URL, tokenStore } from "./api";

type Raw = Record<string, unknown>;

export type ProductsResult =
  | { ok: true; products: Product[]; categories: MenuCategory[] }
  | { ok: false; reason: "config" | "unauthorized" | "network" | "server" | "empty" };

const TIMEOUT_MS = 12000;
const PER_PAGE = 100;
/** Stop after this many pages (100 × 20 = 2,000 products). */
const MAX_PAGES = 20;
const UNCATEGORISED = { id: "more", name: "More" };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const pick = (raw: Raw, ...keys: string[]) => keys.map((k) => raw[k]).find((v) => v !== undefined && v !== null && v !== "");
const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const isFalsy = (v: unknown) => v === false || v === 0 || v === "0" || /^(false|no|inactive|disabled|unavailable|hidden)$/i.test(str(v));
/** Missing flags count as "yes". */
const flagOn = (v: unknown) => v === undefined || v === null || !isFalsy(v);

/** API price in pounds (6.99, "6.99", "£6.99") → pence, or null if it isn't a valid price. */
function toPence(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(str(v).replace(/[£,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
}

/** Prefers the POS's ready-made `image_url`; a bare storage path is served from /storage/ (Laravel's public disk). */
function toImageUrl(raw: Raw): string | undefined {
  const url = str(pick(raw, "image_url", "imageUrl", "photo_url", "thumbnail_url")) || str(pick(raw, "image", "photo", "thumbnail"));
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  try {
    const path = url.replace(/^\/+/, "");
    const withStorage = /^(storage|images|uploads)\//.test(path) ? path : `storage/${path}`;
    return new URL(`/${withStorage}`, new URL(API_BASE_URL).origin).href;
  } catch {
    return undefined;
  }
}

/** Price adjustment of the only available variant (0 when there are none or several). */
function soleVariantPence(raw: Raw) {
  const variants = (Array.isArray(raw.variants) ? (raw.variants as Raw[]) : []).filter((v) => str(v.name) && flagOn(v.is_available));
  return variants.length === 1 ? (toPence(variants[0].price_adjustment) ?? 0) : 0;
}

/** Variants become a "choose one" option (price adjustments added), add-ons an optional multi-pick. */
function toOptions(raw: Raw): OptionGroup[] | undefined {
  const groups: OptionGroup[] = [];
  const variants = (Array.isArray(raw.variants) ? (raw.variants as Raw[]) : []).filter((v) => str(v.name) && flagOn(v.is_available));
  if (variants.length > 1) {
    // The POS's default variant first, since the first choice is preselected.
    variants.sort((a, b) => Number(Boolean(b.is_default)) - Number(Boolean(a.is_default)));
    groups.push({
      id: "variant",
      label: "Choose",
      type: "single",
      choices: variants.map((v, i) => ({ id: str(v.id) || `v${i}`, label: str(v.name), price: toPence(v.price_adjustment) || undefined })),
    });
  }
  const addons = (Array.isArray(raw.addons) ? (raw.addons as Raw[]) : []).filter((a) => str(a.name) && flagOn(a.is_available));
  if (addons.length) {
    groups.push({
      id: "addons",
      label: "Add extras",
      type: "multi",
      choices: addons.map((a, i) => ({ id: str(a.id) || `a${i}`, label: str(a.name), price: toPence(a.price) || undefined })),
    });
  }
  return groups.length ? groups : undefined;
}

type CategoryInfo = { name: string; imageUrl?: string; active: boolean };

/** One API record → a site Product (with its category), or null if hidden, unpriced or not in GBP. */
function toProduct(raw: Raw, categoriesById: Map<string, CategoryInfo>): { product: Product; category: { id: string; name: string } } | null {
  const name = str(pick(raw, "name", "title", "product_name"));
  const base = toPence(pick(raw, "price", "sale_price", "base_price", "unit_price"));
  if (!name || base === null) return null;
  if (!flagOn(raw.is_active) || !flagOn(pick(raw, "is_available", "available"))) return null;
  // The site shows prices in pounds; skip anything priced in another currency rather than mislabel it.
  const currency = str(raw.currency).toUpperCase();
  if (currency && currency !== "GBP") return null;

  // Category: the embedded relation, a plain name, or a lookup of category_id in /categories.
  const rel = raw.category;
  const fromList = categoriesById.get(str(raw.category_id));
  if (fromList && !fromList.active) return null;
  const label = (isObj(rel) ? str(pick(rel, "name", "title")) : str(rel)) || str(raw.category_name) || fromList?.name || "";
  const category = label && slug(label) ? { id: slug(label), name: label } : UNCATEGORISED;

  // Discounts: the POS works out current_price; the original is shown struck through.
  const current = toPence(raw.current_price);
  const discounted = current !== null && current < base && raw.has_active_discount !== false;
  // A product with just one size carries its price on that size (e.g. £0 base + "Only" £4.99): add it in.
  const single = soleVariantPence(raw);
  const apiId = str(pick(raw, "id", "uuid", "sku")) || slug(name);

  return {
    category,
    product: {
      id: `pos-${apiId}`,
      apiId,
      name,
      description: str(pick(raw, "short_description", "description", "details")) || undefined,
      price: (discounted ? current : base) + single,
      originalPrice: discounted ? base + single : undefined,
      category: category.id,
      imageUrl: toImageUrl(raw),
      stockImage: stockPhotoFor(name, label),
      imageAlt: name,
      options: toOptions(raw),
      bestSeller: raw.is_featured === true || raw.is_featured === 1 || raw.is_featured === "1",
      available: true,
    },
  };
}

/** Records from any of the usual list shapes, including { products: { data: [...] } }. */
function records(body: unknown): Raw[] {
  if (Array.isArray(body)) return body as Raw[];
  if (isObj(body)) {
    for (const key of ["products", "data", "items", "results"]) {
      const v = body[key];
      if (Array.isArray(v)) return v as Raw[];
      if (isObj(v) && Array.isArray(v.data)) return v.data as Raw[];
    }
  }
  return [];
}

/** The next page URL, from a top-level or nested ({ products: { next_page_url } }) paginator. */
function nextPage(body: unknown): string | null {
  if (!isObj(body)) return null;
  for (const p of [body, body.products, body.data]) {
    if (!isObj(p)) continue;
    const links = p.links;
    const next = str(p.next_page_url) || (isObj(links) ? str(links.next) : "");
    if (next) return next;
  }
  return null;
}

/** Keeps paging through the same route: a POS "next page" URL is re-pointed at `base` (e.g. the proxy). */
function viaBase(next: string | null, base: string): string | null {
  if (!next) return null;
  try {
    const u = new URL(next, location.origin);
    return `${base}/products${u.search}`;
  } catch {
    return null;
  }
}

async function getJson(url: string, headers: Record<string, string>): Promise<{ status: number; body?: unknown }> {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  return res.ok ? { status: res.status, body: await res.json() } : { status: res.status };
}

/** /categories, for names, order and on/off status. Optional: products carry their category anyway. */
async function fetchCategories(base: string, headers: Record<string, string>): Promise<{ order: string[]; byId: Map<string, CategoryInfo> }> {
  const byId = new Map<string, CategoryInfo>();
  const order: string[] = [];
  try {
    const { body } = await getJson(`${base}/categories`, headers);
    const list = isObj(body) && Array.isArray(body.categories) ? (body.categories as Raw[]) : records(body);
    for (const c of list) {
      const name = str(pick(c, "name", "title"));
      if (!name) continue;
      const imageUrl = toImageUrl(c);
      byId.set(str(c.id), { name, imageUrl, active: flagOn(c.is_active) });
      order.push(slug(name));
    }
  } catch {
    // Without the list, categories follow the order products arrive in.
  }
  return { order, byId };
}

/** Same-origin menu proxy (see server/menuProxy.js). */
const PROXY_BASE = "/menu-api";

export async function fetchProducts(): Promise<ProductsResult> {
  const viaProxy = await loadMenu(PROXY_BASE, { Accept: "application/json" });
  if (viaProxy.ok || viaProxy.reason === "empty") return viaProxy;

  // No proxy (or it failed): ask the POS directly, with the visitor's own login when there is one.
  if (!API_BASE_URL) return viaProxy;
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  return loadMenu(API_BASE_URL, headers);
}

async function loadMenu(base: string, headers: Record<string, string>): Promise<ProductsResult> {
  const all: Raw[] = [];
  let categoryData: Awaited<ReturnType<typeof fetchCategories>>;
  try {
    // Categories are only requested once products load, so a refused request isn't made twice.
    let categoriesPromise: ReturnType<typeof fetchCategories> | undefined;
    let url: string | null = `${base}/products?per_page=${PER_PAGE}`;
    for (let page = 0; url && page < MAX_PAGES; page++) {
      const { status, body } = await getJson(url, headers);
      if (status === 401 || status === 403) return { ok: false, reason: "unauthorized" };
      if (!body) return { ok: false, reason: status === 503 ? "config" : "server" };
      if (isObj(body) && body.success === false) return { ok: false, reason: "server" };
      categoriesPromise ??= fetchCategories(base, headers);
      all.push(...records(body));
      url = viaBase(nextPage(body), base);
    }
    categoryData = (await categoriesPromise) ?? { order: [], byId: new Map() };
  } catch {
    return { ok: false, reason: "network" };
  }

  const mapped = all.map((r) => toProduct(r, categoryData.byId)).filter((m) => m !== null);
  const products = mapped.map((m) => m.product);

  // One section per portal category: in the portal's category order when known, else as products arrive.
  const imageBySlug = new Map([...categoryData.byId.values()].map((c) => [slug(c.name), c.imageUrl]));
  const sections = new Map(mapped.map((m) => [m.category.id, m.category.name] as const));
  const rank = (id: string) => (categoryData.order.includes(id) ? categoryData.order.indexOf(id) : Number.MAX_SAFE_INTEGER);
  const categories = [...sections.entries()]
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([id, name]) => {
      const c = makeCategory(id, name);
      const image = imageBySlug.get(id);
      return image ? { ...c, tile: image } : c;
    });
  return products.length ? { ok: true, products, categories } : { ok: false, reason: "empty" };
}
