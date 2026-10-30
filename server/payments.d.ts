import type { IncomingMessage, ServerResponse } from "node:http";

export function createPayments(config: {
  stripeKey?: string;
  siteUrl?: string;
  pos: { baseUrl?: string; email?: string; password?: string };
  order?: { email?: string; password?: string };
  webhookSecret?: string;
  whatsapp?: { phone?: string; apiKey?: string; baseUrl?: string };
}): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>;
