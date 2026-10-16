// @ts-check
/**
 * Production server: serves the built site (dist/) and the menu proxy (/menu-api).
 *
 *   npm run build
 *   npm start            (PORT defaults to 3000)
 *
 * Needs the same server-only env vars as development: POS_API_BASE_URL, POS_MENU_EMAIL,
 * POS_MENU_PASSWORD, STRIPE_SECRET_KEY and SITE_URL (e.g. https://www.paradisegrill.co.uk). Set them in your host's environment settings (or a .env file next to
 * package.json). Never prefix them with VITE_ — that would publish them in the browser code.
 */

import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createMenuProxy } from "./menuProxy.js";
import { createPayments } from "./payments.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dist = join(root, "dist");

// Minimal .env support (KEY=value lines), without overriding real environment variables.
for (const file of [".env", ".env.local"]) {
  const path = join(root, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const pos = {
  baseUrl: process.env.POS_API_BASE_URL || process.env.VITE_API_BASE_URL,
  email: process.env.POS_MENU_EMAIL,
  password: process.env.POS_MENU_PASSWORD,
};
const menuProxy = createMenuProxy(pos);
const payments = createPayments({ stripeKey: process.env.STRIPE_SECRET_KEY, siteUrl: process.env.SITE_URL, pos });

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
};

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://local").pathname);
  if (pathname.startsWith("/menu-api")) return menuProxy(req, res);
  if (pathname.startsWith("/pay-api/")) return payments(req, res);

  // Static files; every other route gets index.html so the React router can handle it.
  const file = normalize(join(dist, pathname));
  const safe = file.startsWith(dist) && existsSync(file) && statSync(file).isFile();
  const target = safe ? file : join(dist, "index.html");
  const ext = extname(target);
  res.setHeader("Content-Type", TYPES[/** @type {keyof typeof TYPES} */ (ext)] ?? "application/octet-stream");
  res.setHeader("Cache-Control", pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache");
  createReadStream(target).pipe(res);
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => console.log(`Paradise Grill and Pizza running on http://localhost:${port}`));
