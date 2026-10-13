import type { MouseEvent } from "react";
import { UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ACCOUNT_PANEL_ID } from "./AccountPanel";

interface AccountButtonProps {
  expanded: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Header account trigger. Signed out: "Log in / Register". Signed in: the user's first name.
 * The text shows from 1200px; below that it's an icon with the same accessible name.
 */
export function AccountButton({ expanded, onClick }: AccountButtonProps) {
  const { status, user } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";
  const signedIn = status === "authenticated" && !!user;
  const accessibleName = signedIn ? `Account: ${user.name}` : status === "loading" ? "Account" : "Account: log in or register";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleName}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={ACCOUNT_PANEL_ID}
      className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-ink transition-colors duration-200 hover:text-brand aria-expanded:text-brand desk:px-3"
    >
      <UserRound size={20} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
      {status !== "loading" && (
        <span aria-hidden="true" className="hidden max-w-[8rem] truncate desk:inline">
          {signedIn ? (
            firstName
          ) : (
            <>
              Log in<span className="hidden wide:inline"> / Register</span>
            </>
          )}
        </span>
      )}
    </button>
  );
}
