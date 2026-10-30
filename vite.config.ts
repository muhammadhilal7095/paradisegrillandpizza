import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createMenuProxy } from "./server/menuProxy.js";
import { createPayments } from "./server/payments.js";

/** Serves /menu-api (server/menuProxy.js) and /pay-api (server/payments.js) from the dev and preview servers. */
function serverRoutesPlugin(env: Record<string, string>): Plugin {
  const pos = { baseUrl: env.POS_API_BASE_URL || env.VITE_API_BASE_URL, email: env.POS_MENU_EMAIL, password: env.POS_MENU_PASSWORD };
  const proxy = createMenuProxy(pos);
  const payments = createPayments({ stripeKey: env.STRIPE_SECRET_KEY, siteUrl: env.SITE_URL, pos, order: { email: env.POS_ORDER_EMAIL, password: env.POS_ORDER_PASSWORD }, webhookSecret: env.STRIPE_WEBHOOK_SECRET, whatsapp: { phone: env.WHATSAPP_NOTIFY_PHONE || "447486643846", apiKey: env.WHATSAPP_NOTIFY_APIKEY, baseUrl: env.WHATSAPP_NOTIFY_BASE } });
  const handle = (req: Parameters<typeof proxy>[0], res: Parameters<typeof proxy>[1], next: () => void) =>
    void proxy(req, res, () => void payments(req, res, next));
  return {
    name: "server-routes",
    configureServer: (server) => void server.middlewares.use(handle),
    configurePreviewServer: (server) => void server.middlewares.use(handle),
  };
}

export default defineConfig(({ mode }) => {
  // "" loads every variable, including the server-only POS_* ones; only VITE_* reach the browser.
  const env = loadEnv(mode, process.cwd(), "");
  return { plugins: [react(), tailwindcss(), serverRoutesPlugin(env)] };
});
