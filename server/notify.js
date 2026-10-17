// @ts-check
/**
 * Sends order alerts to the restaurant's WhatsApp through CallMeBot (https://www.callmebot.com),
 * a free service for sending messages to your OWN WhatsApp number. Server-only.
 *
 * Setup (once, from the restaurant's phone): follow CallMeBot's WhatsApp instructions to get an
 * API key for +44 7486 643846, then set WHATSAPP_NOTIFY_APIKEY (and optionally WHATSAPP_NOTIFY_PHONE)
 * in the server's environment. Without a key, alerts are simply skipped.
 */

const DEFAULT_BASE = "https://api.callmebot.com/whatsapp.php";

/**
 * @param {{ phone?: string; apiKey?: string; baseUrl?: string }} config
 */
export function createWhatsAppNotifier({ phone = "", apiKey = "", baseUrl = "" }) {
  const to = phone.replace(/\D/g, "");
  const key = apiKey.trim();
  const base = (baseUrl || DEFAULT_BASE).trim();
  const enabled = Boolean(to && key);

  /** @param {string} text @returns {Promise<boolean>} true when the service accepted the message */
  async function send(text) {
    if (!enabled) return false;
    const url = `${base}?phone=${encodeURIComponent(`+${to}`)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(key)}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      const body = await res.text();
      // CallMeBot answers 200 with an HTML page; failures mention an error.
      const ok = res.ok && !/error|invalid|not.*(allowed|valid)/i.test(body);
      if (!ok) console.error("[whatsapp-notify] not sent:", res.status, body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 200));
      return ok;
    } catch (error) {
      console.error("[whatsapp-notify]", error instanceof Error ? error.message : error);
      return false;
    }
  }

  return { enabled, send };
}
