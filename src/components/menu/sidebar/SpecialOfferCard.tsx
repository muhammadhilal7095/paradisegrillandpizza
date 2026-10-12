import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TODAYS_SPECIAL } from "../../../config/site";
import { BrushStroke } from "../../ui/BrushStroke";
import { buttonClasses } from "../../ui/button";

export function SpecialOfferCard() {
  return (
    <section
      aria-labelledby="todays-special-title"
      className="relative isolate flex flex-col overflow-hidden rounded-2xl bg-deep p-5 text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_70%_80%,rgba(242,27,45,0.18),transparent_70%)]"
      />
      <p className="text-[13px] font-semibold tracking-[0.08em] text-white/85 uppercase">{TODAYS_SPECIAL.eyebrow}</p>
      <h2 id="todays-special-title" className="mt-2">
        <span className="relative inline-block px-4 py-1.5">
          <BrushStroke className="absolute inset-0 -z-10 size-full -rotate-2 text-brand" />
          <span className="block -rotate-2 font-display text-[38px] leading-none font-extrabold tracking-[-0.5px]">
            {TODAYS_SPECIAL.headline}
          </span>
        </span>
        <span className="mt-2 block text-[16px] font-semibold">{TODAYS_SPECIAL.subline}</span>
      </h2>
      <Link to={TODAYS_SPECIAL.to} className={buttonClasses("primary", "sm", "mt-4 self-start")}>
        Order Now
        <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
      </Link>
      <img
        src="/images/banner-800.webp"
        alt=""
        width={800}
        height={533}
        loading="lazy"
        decoding="async"
        className="-mr-5 -mb-5 ml-auto w-[88%] max-w-[360px] [mask-image:radial-gradient(ellipse_closest-side,#000_70%,transparent_100%)]"
      />
    </section>
  );
}
