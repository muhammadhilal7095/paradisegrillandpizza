// @ts-check
/**
 * Server-side POS client: reads from the POS API, logged in with the website's own customer
 * account (POS_MENU_EMAIL / POS_MENU_PASSWORD) when it has one. Shared by the menu proxy and
 * the payment server. Never runs in the browser.
 */

const TIMEOUT_MS = 15_000;

/**
 * @param {{ baseUrl?: string; email?: string; password?: string }} config
 */
export function createPosClient({ baseUrl = "", email = "", password = "" }) {
  const base = baseUrl.trim().replace(/\/+$/, "");
  const hasAccount = Boolean(base && email && password);
  /** @type {string | null} */
  let token = null;
  /** @type {Promise<string> | null} */
  let loggingIn = null;

  async function login() {
    const res = await fetch(`${base}/mobile/auth/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, device_platform: "web" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = /** @type {any} */ (await res.json().catch(() => ({})));
    const t = body.token ?? body.access_token ?? body.data?.token ?? body.data?.access_token;
    if (!res.ok || typeof t !== "string" || !t) throw new Error(`POS login failed (${res.status})`);
    return t;
  }

  /** One login at a time, shared by concurrent requests. */
  async function getToken(force = false) {
    if (token && !force) return token;
    loggingIn ??= login().finally(() => (loggingIn = null));
    token = await loggingIn;
    return token;
  }

  /**
   * GET a POS path (e.g. "/products?per_page=100"). Uses the website account when configured,
   * otherwise `fallbackAuth` (a visitor's own "Bearer …" header), otherwise no login.
   * @param {string} pathAndQuery
   * @param {string} [fallbackAuth]
   * @returns {Promise<{ status: number; body: string }>}
   */
  async function get(pathAndQuery, fallbackAuth, retry = true) {
    /** @type {Record<string, string>} */
    const headers = { Accept: "application/json" };
    if (hasAccount) headers.Authorization = `Bearer ${await getToken()}`;
    else if (fallbackAuth) headers.Authorization = fallbackAuth;
    const res = await fetch(`${base}${pathAndQuery}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (hasAccount && retry && (res.status === 401 || res.status === 403)) {
      // Token expired or was revoked: log in again once.
      await getToken(true);
      return get(pathAndQuery, fallbackAuth, false);
    }
    return { status: res.status, body: await res.text() };
  }

  return { configured: Boolean(base), hasAccount, get };
}
