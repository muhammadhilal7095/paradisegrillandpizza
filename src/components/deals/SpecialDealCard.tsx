import { useState } from "react";
import { ShoppingBag, Tag } from "lucide-react";
import { FALLBACK_PHOTO, formatPrice } from "../../data/menu";
import type { SpecialDeal } from "../../lib/deals";
import { buttonClasses } from "../ui/button";
import { DealBuilderDialog } from "./DealBuilderDialog";

/**
 * A special deal from the POS, styled like the menu's DealCard: square 1080×1080 banner, title, description,
 * what's included, price and a full-width "Build your deal" button.
 * "wide": photo left, details right (for one or two deals). "tall": photo on top (for three or more).
 */
export function SpecialDealCard({ deal, layout = "wide" }: { deal: SpecialDeal; layout?: "wide" | "tall" }) {
  const [open, setOpen] = useState(false);
  const orderable = deal.price !== null && deal.slots.length > 0;
  const wide = layout === "wide";

  return (
    <article
      className={`group relative flex w-full overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1 ${
        wide ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-mist ${wide ? "aspect-square sm:aspect-auto sm:min-h-[300px] sm:w-1/2 sm:self-stretch" : "aspect-square"}`}>
        <img
          src={deal.bannerUrl ?? FALLBACK_PHOTO}
          alt={deal.title}
          width={1080}
          height={1080}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PHOTO;
            e.currentTarget.classList.add("object-contain", "p-[12%]");
          }}
          className={`absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.04] ${deal.bannerUrl ? "object-cover" : "object-contain p-[12%]"}`}
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-white uppercase shadow-[0_4px_12px_rgba(224,48,30,0.35)]">
          <Tag size={12} strokeWidth={2.4} aria-hidden="true" />
          Deal
        </span>
        {deal.badge && <span className="absolute top-3 right-3 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold text-white">{deal.badge}</span>}
      </div>

      <div className={`flex flex-1 flex-col ${wide ? "p-5 sm:border-l sm:border-line md:p-6" : "border-t border-line p-4 md:p-5"}`}>
        <h3 title={deal.title} className={`font-display leading-snug font-bold text-ink ${wide ? "line-clamp-3 text-[18px] md:text-[20px]" : "line-clamp-2 text-[16px] md:text-[17px]"}`}>
          {deal.title}
        </h3>
        {deal.description && (
          <p title={deal.description} className={`mt-2 text-[13px] leading-relaxed text-muted ${wide ? "line-clamp-3 md:text-[14px]" : "line-clamp-2"}`}>
            {deal.description}
          </p>
        )}
        {deal.slots.length > 0 && (
          <p className="mt-3 text-[13px] font-medium text-soft">
            {deal.slots.map((slot) => `${slot.quantity} × ${slot.name}${slot.choices.length > 1 ? ` (choose from ${slot.choices.length})` : ""}`).join(" · ")}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-dashed border-line pt-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">Deal price</p>
              <p className={`mt-0.5 font-display leading-none font-extrabold text-ink ${wide ? "text-[28px]" : "text-[24px]"}`}>
                {deal.price !== null ? formatPrice(deal.price) : deal.badge}
              </p>
            </div>
            <ShoppingBag size={26} strokeWidth={1.6} aria-hidden="true" className="mb-0.5 text-brand/25" />
          </div>
          {orderable && (
            <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={buttonClasses("primary", "md", "mt-4 w-full")}>
              Build your deal
            </button>
          )}
        </div>
      </div>
      {open && <DealBuilderDialog deal={deal} onClose={() => setOpen(false)} />}
    </article>
  );
}
