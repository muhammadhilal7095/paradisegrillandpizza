import type { IncomingMessage, ServerResponse } from "node:http";

export function createPayments(config: {
  stripeKey?: string;
  siteUrl?: string;
  pos: { baseUrl?: string; email?: string; password?: string };
}): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>;
