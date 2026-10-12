import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";

/** Dark closing banner: handwritten slogan, burger photo, "Capture the Flavour" call to action. */
export function GalleryPromoBanner() {
  return (
    <section aria-labelledby="capture-title" className="relative isolate overflow-hidden bg-deep text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_70%_at_50%_55%,rgba(242,27,45,0.16),transparent_70%)]"
      />
      <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-4 py-12 md:grid-cols-[1fr_1.2fr] md:px-6 lg:grid-cols-[0.8fr_1.3fr_1fr] lg:py-6 desk:px-8 wide:px-12">
        {/* Decorative slogan — the heading on the right carries the message. */}
        <div aria-hidden="true" className="flex items-center justify-center gap-3 lg:justify-end">
          <p className="-rotate-6 text-center font-hand text-[34px] leading-[0.95] lg:text-left lg:text-[46px]">
            <span className="lg:block">Good </span>
            <span className="lg:block">Food </span>
            <span className="text-brand lg:block">Good </span>
            <span className="text-brand lg:block">Mood</span>
          </p>
          <svg viewBox="0 0 70 50" className="hidden h-12 w-16 text-white/80 lg:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 10c20-6 42 2 56 26" />
            <path d="M50 34l11 4 1-12" />
          </svg>
        </div>

        <img
          src="/images/banner-1600.webp"
          srcSet="/images/banner-800.webp 800w, /images/banner-1600.webp 1600w"
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 55vw, 100vw"
          width={1600}
          height={1067}
          alt="Sesame chicken burger with a basket of fries"
          loading="lazy"
          decoding="async"
          className="mx-auto w-full max-w-[540px] object-contain [mask-image:radial-gradient(ellipse_closest-side,#000_72%,transparent_100%)]"
        />

        <div className="flex flex-col items-center text-center md:col-span-2 lg:col-span-1 lg:items-start lg:text-left">
          <h2 id="capture-title" className="font-display text-[32px] leading-[1.05] font-extrabold tracking-[-0.6px] md:text-[38px] desk:text-[42px]">
            <span className="block">Capture the</span>
            <span className="block text-brand">Flavour</span>
          </h2>
          <p className="mt-3 text-[14px] text-white/80">Fresh ingredients. Great taste. Better moments.</p>
          <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-6")}>
            Order Now
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
