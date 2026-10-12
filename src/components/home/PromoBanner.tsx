import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { BrushStroke } from "../ui/BrushStroke";
import { buttonClasses } from "../ui/button";

const PERKS = ["Fresh Ingredients", "Great Taste", "Best Deals"];

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
