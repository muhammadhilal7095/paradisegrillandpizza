import { RefreshCw, UtensilsCrossed } from "lucide-react";
import { CONTACT } from "../../config/contact";
import { useMenu } from "../../context/menuStore";
import { buttonClasses } from "../ui/button";

/** Grey placeholder cards while the menu loads from the POS. */
export function MenuSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul aria-hidden="true" className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="aspect-square animate-pulse bg-mist" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-mist" />
            <div className="h-3 w-full animate-pulse rounded bg-mist" />
            <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-mist" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * What to show instead of products: a skeleton while loading, or a friendly
 * "menu unavailable" message (with the phone number and a retry) when the POS can't be reached.
 */
export function MenuStatusNotice({ skeletonCount }: { skeletonCount?: number }) {
  const { status, reload } = useMenu();
  if (status === "loading")
    return (
      <div role="status">
        <span className="sr-only">Loading the menu…</span>
        <MenuSkeleton count={skeletonCount} />
      </div>
    );
  if (status !== "unavailable") return null;
  return (
    <div role="status" className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-mist px-6 py-12 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-white text-brand">
        <UtensilsCrossed size={24} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-[20px] font-bold text-ink">Our online menu is temporarily unavailable</p>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted">
        We couldn't load today's menu. Please try again in a moment{CONTACT.phones[0] ? <>, or call us on <span className="font-semibold text-ink">{CONTACT.phones[0]}</span> to order</> : null}.
      </p>
      <button type="button" onClick={reload} className={buttonClasses("primary", "md", "mt-6")}>
        <RefreshCw size={16} strokeWidth={2.2} aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}
