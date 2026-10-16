// @ts-check
/**
 * Server-side menu proxy. Runs on the web server — never in the browser.
 *
 * The POS only shares products with logged-in accounts. This proxy logs in with a dedicated
 * customer account (POS_MENU_EMAIL / POS_MENU_PASSWORD, server-only env vars) and passes
 * read-only menu requests through, so every visitor sees the menu without the account's
 * password or token ever reaching the browser.
 *
 *   GET /menu-api/products?…   → GET {POS_API_BASE_URL}/products?…
 *   GET /menu-api/categories   → GET {POS_API_BASE_URL}/categories
 *
 * Only those two GET routes are forwarded; anything else is refused. Responses are cached
 * briefly so a busy site doesn't hammer the POS. Remove this once the POS makes
 * GET /products and GET /categories public.
 */

import { createPosClient } from "./posClient.js";

const ALLOWED = new Set(["/products", "/categories"]);
const CACHE_MS = 60_000;

/**
 * @param {{ baseUrl?: string; email?: string; password?: string }} config
 * @returns {(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, next?: () => void) => Promise<void>}
 */
export function createMenuProxy({ baseUrl = "", email = "", password = "" }) {
  const pos = createPosClient({ baseUrl, email, password });
  /** @type {Map<string, { at: number; status: number; body: string }>} */
  const cache = new Map();

  return async function menuProxy(req, res, next) {
    const url = new URL(req.url ?? "/", "http://local");
    if (!url.pathname.startsWith("/menu-api")) return next?.();
    const path = url.pathname.slice("/menu-api".length) || "/";

    /** @param {number} status @param {string} body @param {string} [cacheState] */
    const send = (status, body, cacheState) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=30");
      if (cacheState) res.setHeader("X-Menu-Cache", cacheState);
      res.end(body);
    };

    if (req.method !== "GET" || !ALLOWED.has(path)) return send(404, JSON.stringify({ message: "Not found" }));
    // The site falls back to calling the POS directly when the proxy isn't set up.
    if (!pos.hasAccount) return send(503, JSON.stringify({ message: "Menu proxy not configured" }));

    const key = path + url.search;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) return send(hit.status, hit.body, "hit");

    try {
      const result = await pos.get(key);
      if (result.status >= 200 && result.status < 300) cache.set(key, { at: Date.now(), ...result });
      send(result.status, result.body, "miss");
    } catch (error) {
      // Serve a stale copy rather than nothing if the POS is briefly unreachable.
      if (hit) return send(hit.status, hit.body, "stale");
      console.error("[menu-proxy]", error instanceof Error ? error.message : error);
      send(502, JSON.stringify({ message: "Menu temporarily unavailable" }));
    }
  };
}
