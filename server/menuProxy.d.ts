import type { IncomingMessage, ServerResponse } from "node:http";

export function createMenuProxy(config: {
  baseUrl?: string;
  email?: string;
  password?: string;
}): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>;
