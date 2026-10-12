import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";

const PERKS = ["Fresh Ingredients", "Great Taste", "Best Deals"];

/** Red painted brush stroke behind the slogan. */
function BrushStroke({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 170" preserveAspectRatio="none" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16 40c40-16 118-22 196-20s150-6 190 6c6 2 8 8 4 12-6 6 6 10 2 18-4 10 10 16 2 26-6 8 6 14-2 22s4 14-6 20c-60 18-160 24-250 20-46-2-90-2-128-12-8-2-10-8-4-12 6-6-6-10 0-18 5-7-8-13 0-21 6-7-7-14 0-21 4-5-8-12-4-20Z" />
      <path d="M40 22c60-8 130-10 200-6" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M70 156c70 6 160 4 250-6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M400 70c10 0 14 4 16 8M6 112c-4 4-5 8-4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function PromoBanner() {
  return (
    <section aria-labelledby="promo-title" className="relative isolate overflow-hidden bg-deep">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_70%_at_50%_55%,rgba(242,27,45,0.16),transparent_70%)]"
      />
      <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-4 py-12 md:grid-cols-[1fr_1.1fr] md:px-6 lg:grid-cols-[1fr_1.25fr_0.9fr] lg:py-6 desk:px-8 wide:px-12">
        {/* Slogan */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="relative px-7 py-5">
            <BrushStroke className="absolute inset-0 -z-10 size-full -rotate-2 text-brand" />
            <h2
              id="promo-title"
              className="-rotate-2 font-display text-[34px] leading-[1.02] font-extrabold tracking-[-0.5px] text-white uppercase md:text-[40px] desk:text-[48px]"
            >
              <span className="block">Good Food</span>
              <span className="block">Good Mood</span>
            </h2>
          </div>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px] font-medium text-white/80 md:justify-start">
            {PERKS.map((perk, i) => (
              <li key={perk} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-white/40" />}
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Photo — the source has a pure black background that melts into the section. */}
        <img
          src="/images/banner-1600.webp"
          srcSet="/images/banner-800.webp 800w, /images/banner-1600.webp 1600w"
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
          width={1600}
          height={1067}
          alt="Sesame chicken burger with a basket of fries"
          loading="lazy"
          decoding="async"
          className="mx-auto w-full max-w-[560px] object-contain [mask-image:radial-gradient(ellipse_closest-side,#000_72%,transparent_100%)]"
        />

        {/* Call to action */}
        <div className="flex flex-col items-center gap-5 md:col-span-2 lg:col-span-1 lg:items-start">
          <p className="-rotate-3 font-hand text-[30px] leading-none text-white desk:text-[34px]">Taste the Difference</p>
          <Link to={ORDER_PATH} className={buttonClasses("primary", "md")}>
            Order Now
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
