import type { ReactNode } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Checking() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-mist" aria-busy="true">
      <p role="status" className="flex items-center gap-2 text-[14px] text-muted">
        <LoaderCircle size={18} strokeWidth={2} aria-hidden="true" className="motion-safe:animate-spin" />
        Checking your account…
      </p>
    </main>
  );
}

/** Only for signed-in visitors; everyone else is sent to /login and brought back afterwards. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, signOutNotice } = useAuth();
  const location = useLocation();
  if (status === "loading") return <Checking />;
  if (status === "guest") {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    // Carry the sign-out reason (expired session, logged out) to the login page.
    return <Navigate to={`/login?next=${next}`} replace state={signOutNotice ? { notice: signOutNotice } : undefined} />;
  }
  return <>{children}</>;
}

/** Only for signed-out visitors (login, register): signed-in visitors go straight on. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const [params] = useSearchParams();
  if (status === "loading") return <Checking />;
  if (status === "authenticated") return <Navigate to={safeNext(params.get("next"))} replace />;
  return <>{children}</>;
}

/** Only same-site paths are allowed as a post-login destination (no open redirects). */
export function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}
