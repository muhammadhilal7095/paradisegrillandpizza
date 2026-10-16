/**
 * Single API client for the Paradise Gap mobile auth API.
 *
 * - Base URL comes from VITE_API_BASE_URL (never hardcoded). Example: put
 *   VITE_API_BASE_URL=https://example.com/api in .env.local (git-ignored).
 * - Protected calls get `Authorization: Bearer <token>` automatically.
 * - Errors become an ApiError with a `kind` the UI can switch on:
 *   validation (422, with per-field messages), forbidden (403, account disabled),
 *   unauthorized (401), network, config, server.
 * - Only the token is persisted. Passwords are sent once and never stored.
 */

const BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "").trim().replace(/\/+$/, "");
const TOKEN_KEY = "burgerbite-auth-token";
const TIMEOUT_MS = 20000;

// ---------- Types ----------

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  is_active?: boolean;
  device_platform?: string | null;
  device_model?: string | null;
  last_login_at?: string | null;
  created_at?: string | null;
}

export interface AuthResult {
  user: User;
  token: string;
}

export type ApiErrorKind = "validation" | "unauthorized" | "forbidden" | "network" | "config" | "server";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;
  /** Field name → first message, from a 422 response. */
  readonly fieldErrors: Record<string, string>;

  constructor(kind: ApiErrorKind, message: string, status = 0, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// ---------- Token storage (token only — never passwords) ----------

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage blocked: the session still works until the tab closes.
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};

/** Called when a protected request comes back 401 (token missing/expired/revoked). */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export const isApiConfigured = () => BASE_URL.length > 0;

/** Base URL (no trailing slash), for modules that make their own requests. */
export const API_BASE_URL = BASE_URL;

// ---------- Core request ----------

type Json = Record<string, unknown>;

const firstMessage = (value: unknown) => (Array.isArray(value) ? String(value[0] ?? "") : String(value ?? ""));

async function request<T = Json>(method: "GET" | "POST" | "PUT", path: string, options: { body?: Json; auth?: boolean; /** Skip the global 401 handler (used by logout). */ quiet401?: boolean } = {}): Promise<T> {
  if (!BASE_URL) {
    throw new ApiError("config", "Accounts aren't available yet — the site isn't connected to the account service.");
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body) headers["Content-Type"] = "application/json";
  if (options.auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new ApiError("network", "We couldn't reach the server. Please check your connection and try again.");
  }

  let data: Json = {};
  try {
    const text = await response.text();
    data = text ? (JSON.parse(text) as Json) : {};
  } catch {
    // Non-JSON body (e.g. an HTML error page) — fall through to status handling.
  }
  const serverMessage = typeof data.message === "string" ? data.message : "";

  if (response.ok) return data as T;

  if (response.status === 401) {
    if (options.auth) {
      tokenStore.clear();
      if (!options.quiet401) onUnauthorized?.();
      throw new ApiError("unauthorized", "Your session has expired. Please log in again.", 401);
    }
    // A public endpoint (e.g. wrong login details) — show the server's message.
    throw new ApiError("unauthorized", serverMessage || "Those details didn't work. Please check and try again.", 401);
  }

  if (response.status === 403) {
    throw new ApiError("forbidden", serverMessage || "Your account has been disabled. Please contact support for help.", 403);
  }

  if (response.status === 422) {
    const errors = (data.errors ?? {}) as Record<string, unknown>;
    const fieldErrors = Object.fromEntries(Object.entries(errors).map(([field, msgs]) => [field, firstMessage(msgs)]));
    throw new ApiError("validation", serverMessage || "Please check the highlighted fields.", 422, fieldErrors);
  }

  throw new ApiError("server", "Something went wrong on our side. Please try again in a moment.", response.status);
}

// ---------- Response normalisation (tolerates flat or { data: … } envelopes) ----------

const asObject = (v: unknown): Json | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Json) : null);

function extractUser(body: Json): User {
  const data = asObject(body.data);
  const candidate = asObject(body.user) ?? asObject(data?.user) ?? (data && "email" in data ? data : null) ?? ("email" in body ? body : null);
  if (!candidate) throw new ApiError("server", "Unexpected response from the server.");
  return candidate as unknown as User;
}

function extractAuth(body: Json): AuthResult {
  const data = asObject(body.data);
  const token = body.token ?? body.access_token ?? data?.token ?? data?.access_token;
  if (typeof token !== "string" || !token) throw new ApiError("server", "Unexpected response from the server.");
  return { user: extractUser(body), token };
}

// ---------- Endpoints ----------

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileInput {
  name?: string;
  phone?: string;
}

export interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const body: Json = { ...input };
    if (!input.phone) delete body.phone;
    return extractAuth(await request("POST", "/mobile/auth/register", { body }));
  },

  async login(email: string, password: string): Promise<AuthResult> {
    return extractAuth(await request("POST", "/mobile/auth/login", { body: { email, password } }));
  },

  /** Sends a 6-digit OTP (valid 15 minutes). `debugOtp` only appears when the server runs with APP_DEBUG=true. */
  async forgotPassword(email: string): Promise<{ message: string; debugOtp?: string }> {
    const body = await request<Json>("POST", "/mobile/auth/forgot-password", { body: { email } });
    const data = asObject(body.data);
    const otp = body.debug_otp ?? data?.debug_otp;
    return { message: typeof body.message === "string" ? body.message : "", debugOtp: otp ? String(otp) : undefined };
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    await request("POST", "/mobile/auth/reset-password", { body: { ...input } });
  },

  /** quiet401: on 401 just clear the token (no redirect) — used when silently restoring a session. */
  async me(options: { quiet401?: boolean } = {}): Promise<User> {
    return extractUser(await request("GET", "/mobile/auth/me", { auth: true, quiet401: options.quiet401 }));
  },

  /** Send only the fields that changed. */
  async updateProfile(changes: ProfileInput): Promise<User> {
    return extractUser(await request("PUT", "/mobile/auth/profile", { body: { ...changes }, auth: true }));
  },

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await request("POST", "/mobile/auth/change-password", { body: { ...input }, auth: true });
  },

  async logout(): Promise<void> {
    await request("POST", "/mobile/auth/logout", { auth: true, quiet401: true });
  },
};
