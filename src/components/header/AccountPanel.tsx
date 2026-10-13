import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const ACCOUNT_PANEL_ID = "header-account";

interface AccountPanelProps {
  open: boolean;
  onClose: () => void;
}

const primary =
  "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark";
const outline =
  "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-line px-4 text-[13px] font-semibold text-ink transition-colors hover:border-ink/30 disabled:opacity-70";

/** Account popover: Log in / Register when signed out; name, My Account and Log Out when signed in. */
export function AccountPanel({ open, onClose }: AccountPanelProps) {
  const { status, user, logout } = useAuth();
  const notify = useToast();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const onLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    onClose();
    notify("You've been logged out");
  };

  const signedIn = status === "authenticated" && user;

  return (
    <div
      id={ACCOUNT_PANEL_ID}
      role="dialog"
      aria-labelledby={`${ACCOUNT_PANEL_ID}-title`}
      className="absolute top-[calc(100%+8px)] right-3 w-[min(20rem,calc(100vw-24px))] rounded-xl border border-line bg-white p-5 shadow-[0_12px_32px_-12px_rgba(17,17,17,0.18)] md:right-6 desk:right-8 wide:right-12"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[16px] font-bold ${
            signedIn ? "bg-brand text-white" : "bg-mist text-ink"
          }`}
        >
          {signedIn ? (user.name?.trim()[0] ?? "?").toUpperCase() : <UserRound size={20} strokeWidth={1.8} />}
        </span>
        <div className="min-w-0">
          <h2 ref={headingRef} id={`${ACCOUNT_PANEL_ID}-title`} tabIndex={-1} className="truncate text-[15px] font-semibold text-ink focus:outline-none">
            {signedIn ? user.name : "Your account"}
          </h2>
          {signedIn && <p className="truncate text-[12px] text-muted">{user.email}</p>}
        </div>
      </div>

      {status === "loading" ? (
        <p role="status" className="mt-4 flex items-center gap-2 text-[13px] text-muted">
          <LoaderCircle size={16} strokeWidth={2} aria-hidden="true" className="motion-safe:animate-spin" />
          Checking your account…
        </p>
      ) : signedIn ? (
        <div className="mt-4 flex gap-2">
          <Link to="/account" onClick={onClose} className={primary}>
            My Account
          </Link>
          <button type="button" onClick={onLogout} disabled={loggingOut} className={outline}>
            {loggingOut ? (
              <LoaderCircle size={15} strokeWidth={2} aria-hidden="true" className="motion-safe:animate-spin" />
            ) : (
              <LogOut size={15} strokeWidth={2} aria-hidden="true" />
            )}
            {loggingOut ? "Logging out…" : "Log Out"}
          </button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">Log in to manage your profile and password.</p>
          <div className="mt-4 flex gap-2">
            <Link to="/login" onClick={onClose} className={primary}>
              Log In
            </Link>
            <Link to="/register" onClick={onClose} className={outline}>
              Register
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
