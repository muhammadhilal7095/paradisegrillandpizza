// @ts-check
/**
 * Writes dist/pay-api/config.php for the PHP payment API (public/pay-api/index.php), used on static
 * hosting where the Node server doesn't run. Runs after `vite build` and reads the server-only
 * environment variables the host applies during the build (STRIPE_SECRET_KEY, SITE_URL, …).
 * Locally it also reads .env and .env.local, without overriding real environment variables.
 *
 * The file is protected twice: .htaccess denies it, and running it prints nothing. dist/ is git-ignored.
 * Without STRIPE_SECRET_KEY no file is written and the PHP API reports { enabled: false }.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

for (const file of [".env", ".env.local"]) {
  const path = join(root, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const env = (/** @type {string} */ name) => (process.env[name] ?? "").trim();
const out = join(root, "dist", "pay-api", "config.php");

const stripeKey = env("STRIPE_SECRET_KEY");
if (!stripeKey) {
  console.log("[pay-config] STRIPE_SECRET_KEY not set: card payments stay off on static hosting.");
  process.exit(0);
}
if (/^pk_/.test(stripeKey)) {
  console.warn("[pay-config] STRIPE_SECRET_KEY is a publishable key (pk_…). Use the secret or restricted key (sk_… or rk_…).");
}

/** A PHP single-quoted string literal. */
const phpString = (/** @type {string} */ s) => `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
/** @param {unknown} v @returns {string} */
const phpValue = (v) =>
  v === null || v === undefined
    ? "null"
    : typeof v === "boolean"
      ? String(v)
      : typeof v === "number"
        ? String(v)
        : typeof v === "string"
          ? phpString(v)
          : `array(${Object.entries(/** @type {Record<string, unknown>} */ (v))
              .filter(([k]) => !k.startsWith("_"))
              .map(([k, val]) => `${phpString(k)} => ${phpValue(val)}`)
              .join(", ")})`;

const delivery = JSON.parse(readFileSync(join(root, "src", "config", "delivery.json"), "utf8"));
const config = {
  stripe_key: stripeKey,
  site_url: env("SITE_URL"),
  pos_base: env("POS_API_BASE_URL") || env("VITE_API_BASE_URL"),
  whatsapp_phone: env("WHATSAPP_NOTIFY_PHONE") || "447486643846",
  whatsapp_apikey: env("WHATSAPP_NOTIFY_APIKEY"),
  delivery,
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `<?php\n// Written at build time by scripts/write-pay-config.mjs. Secret: never commit or publish.\nreturn ${phpValue(config)};\n`);
console.log(`[pay-config] wrote ${out} (card payments on for ${config.site_url || "this site"})`);
