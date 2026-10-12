import { Link } from "react-router-dom";
import { ArrowRight, Clock, Sparkles, UtensilsCrossed } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";

/** Slim last-call strip above the footer. */
export function ReminderStrip() {
  return (
    <aside
      aria-label="Deals reminder"
      className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-brand/15 bg-blush px-5 py-4 md:flex-nowrap md:py-3"
    >
      <Sparkles size={20} strokeWidth={1.8} aria-hidden="true" className="hidden shrink-0 text-brand sm:block" />
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-brand">
        <Clock size={18} strokeWidth={2} aria-hidden="true" />
      </span>
      <p className="min-w-[12rem] flex-1 text-[15px] font-semibold text-ink">
        <span className="text-brand-dark">Fresh deals. Limited time.</span> Don't miss out!
      </p>
      <UtensilsCrossed size={20} strokeWidth={1.8} aria-hidden="true" className="hidden shrink-0 text-brand md:block" />
      <Link to={ORDER_PATH} className={buttonClasses("primary", "sm", "w-full sm:w-auto")}>
        Order Now
        <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </aside>
  );
}
