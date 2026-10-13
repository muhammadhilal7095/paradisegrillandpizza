import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, authApi, setUnauthorizedHandler, tokenStore, type ProfileInput, type RegisterInput, type User } from "../lib/api";

type AuthStatus = "loading" | "authenticated" | "guest";

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  /** Why the visitor was last signed out (shown on the login page). */
  signOutNotice: string | null;
  /** Called once the login page has shown the notice. */
  clearSignOutNotice: () => void;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (changes: ProfileInput) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const SESSION_EXPIRED_NOTICE = "Your session has expired. Please log in again.";

/** Shared auth state. Must sit inside the router (it redirects to /login on 401). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() => (tokenStore.get() ? "loading" : "guest"));
  const [signOutNotice, setSignOutNotice] = useState<string | null>(null);

  const signOutLocally = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus("guest");
  }, []);

  // Any protected request that returns 401 lands here: clear state, send the visitor to log in.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSignOutNotice(SESSION_EXPIRED_NOTICE);
      signOutLocally();
      const { pathname, search } = window.location;
      const next = pathname.startsWith("/login") ? undefined : `${pathname}${search}`;
      navigate(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`, { replace: true, state: { notice: SESSION_EXPIRED_NOTICE } });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate, signOutLocally]);

  // Restore the session on first load if a token is stored.
  useEffect(() => {
    if (!tokenStore.get()) return;
    let cancelled = false;
    authApi
      .me({ quiet401: true })
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus("authenticated");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        // Expired/revoked token or disabled account: forget the token. Offline/server errors keep it for the next visit.
        if (error instanceof ApiError && (error.kind === "unauthorized" || error.kind === "forbidden")) tokenStore.clear();
        setUser(null);
        setStatus("guest");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      signOutNotice,
      clearSignOutNotice: () => setSignOutNotice(null),
      async login(email, password) {
        const result = await authApi.login(email, password);
        tokenStore.set(result.token);
        setSignOutNotice(null);
        setUser(result.user);
        setStatus("authenticated");
        return result.user;
      },
      async register(input) {
        const result = await authApi.register(input);
        tokenStore.set(result.token);
        setSignOutNotice(null);
        setUser(result.user);
        setStatus("authenticated");
        return result.user;
      },
      async logout() {
        try {
          await authApi.logout();
        } catch {
          // Even if the server call fails, the local token is removed below.
        } finally {
          setSignOutNotice("You've been logged out.");
          signOutLocally();
        }
      },
      async updateProfile(changes) {
        const updated = await authApi.updateProfile(changes);
        setUser(updated);
        return updated;
      },
    }),
    [status, user, signOutNotice, signOutLocally],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
