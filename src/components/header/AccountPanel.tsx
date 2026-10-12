import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

export const ACCOUNT_PANEL_ID = "header-account";

interface AccountPanelProps {
  open: boolean;
  onClose: () => void;
}

/** Placeholder account popover until authentication is connected. */
export function AccountPanel({ open, onClose }: AccountPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      id={ACCOUNT_PANEL_ID}
      role="dialog"
      aria-labelledby={`${ACCOUNT_PANEL_ID}-title`}
      className="absolute top-[calc(100%+8px)] right-3 w-[min(20rem,calc(100vw-24px))] rounded-xl border border-line bg-white p-5 shadow-[0_12px_32px_-12px_rgba(17,17,17,0.18)] md:right-6 desk:right-8 wide:right-12"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-mist text-ink">
          <UserRound size={20} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <h2
          ref={headingRef}
          id={`${ACCOUNT_PANEL_ID}-title`}
          tabIndex={-1}
          className="text-[15px] font-semibold text-ink focus:outline-none"
        >
          Your account
        </h2>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        Account sign-in is coming soon. In the meantime, browse the menu or get in touch with any questions.
      </p>
      <div className="mt-4 flex gap-2">
        <Link
          to="/menu"
          onClick={onClose}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-brand px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          View menu
        </Link>
        <Link
          to="/contact"
          onClick={onClose}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-line px-4 text-[13px] font-semibold text-ink transition-colors hover:border-ink/30"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
