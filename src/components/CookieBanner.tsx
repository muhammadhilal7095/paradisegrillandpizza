import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { buttonClasses } from "./ui/button";

const KEY = "paradise-cookie-consent";
/** Fired by the footer's "Cookie settings" link to show the banner again. */
export const OPEN_COOKIE_SETTINGS = "paradise:cookie-settings";

type Choice = "granted" | "denied";
declare global {
  interface Window {
    /** Defined in index.html: stores the choice and loads Google's tag only on "granted". */
    paradiseConsent?: (choice: Choice) => void;
  }
}

function savedChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Cookie consent (UK GDPR / PECR). Google Ads tracking loads only after "Accept"; "Reject" keeps it off.
 * Asks once, then again only from the footer link. Necessary storage (basket, sign-in) needs no consent.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(() => savedChoice() === null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS, show);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, show);
  }, []);

  if (!open) return null;

  const choose = (choice: Choice) => {
    const before = savedChoice();
    if (window.paradiseConsent) window.paradiseConsent(choice);
    else {
      try {
        localStorage.setItem(KEY, choice);
      } catch {
        // Storage blocked: the banner will ask again next visit.
      }
    }
    setOpen(false);
    // Turning tracking off after it was on: reload so the already-loaded Google tag is gone.
    if (before === "granted" && choice === "denied") window.location.reload();
  };

  return (
    <section
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-[560px] rounded-2xl border border-line bg-white p-5 text-ink shadow-[0_24px_60px_-20px_rgba(5,5,5,0.45)] print:hidden md:bottom-6"
    >
      <div className="flex gap-3">
        <Cookie size={22} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
        <div>
          <h2 className="font-display text-[16px] font-bold">Cookies</h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
            We'd like to use Google cookies to measure how our ads perform. They're only set if you accept. Your basket and sign-in always
            work either way.{" "}
            <Link to="/privacy#cookies" className="font-semibold text-brand-dark underline underline-offset-2">
              Learn more
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose("denied")} className={buttonClasses("outlineDark", "md", "w-full")}>
          Reject
        </button>
        <button type="button" onClick={() => choose("granted")} className={buttonClasses("primary", "md", "w-full")}>
          Accept
        </button>
      </div>
    </section>
  );
}
