import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Promotion } from "../../data/promotions";
import { BrushStroke } from "../ui/BrushStroke";
import { buttonClasses } from "../ui/button";

/** Wide dark promo: copy on the left, food photo on the right (photo on top on small phones). */
export function PromotionalBanner({ promo }: { promo: Promotion }) {
  const titleId = `${promo.id}-title`;
  return (
    <article aria-labelledby={titleId} className="relative isolate flex flex-col overflow-hidden rounded-2xl bg-deep text-white sm:min-h-[300px]">
      <div className="relative aspect-[16/9] sm:absolute sm:inset-y-0 sm:right-0 sm:aspect-auto sm:w-[60%]">
        <img
          src={promo.image}
          alt={promo.imageAlt}
          width={900}
          height={600}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0)_55%,#050505_100%)] sm:bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.6)_35%,rgba(5,5,5,0)_75%)]"
        />
      </div>

      <div className="relative flex flex-col items-start p-6 sm:max-w-[56%] sm:justify-center md:p-8">
        <p
          className={
            promo.eyebrowStyle === "hand"
              ? "font-hand text-[26px] leading-none text-white"
              : "text-[12px] font-semibold tracking-[0.16em] text-white/80 uppercase"
          }
        >
          {promo.eyebrow}
        </p>
        <h3 id={titleId} className="mt-3 font-display leading-none font-extrabold tracking-[-0.5px]">
          {promo.lead && <span className="block text-[36px] md:text-[40px]">{promo.lead}</span>}
          <span className="relative mt-1 inline-block px-3 py-1.5">
            <BrushStroke className="absolute inset-0 -z-10 size-full -rotate-2 text-brand" />
            <span className="block -rotate-2 text-[30px] uppercase md:text-[34px]">{promo.highlight}</span>
          </span>
          {promo.follow && <span className="mt-2 block font-sans text-[18px] font-semibold tracking-normal">{promo.follow}</span>}
        </h3>
        <p className="mt-3 max-w-[16rem] font-hand text-[22px] leading-tight text-white/90">{promo.tagline}</p>
        <Link to={promo.ctaTo} className={buttonClasses("primary", "sm", "mt-5")}>
          Order Now
          <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
        </Link>
        {promo.note && <p className="mt-2 text-[11px] text-white/60">{promo.note}</p>}
      </div>
    </article>
  );
}
