import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex flex-col overflow-hidden bg-deep md:block">
      {/* Mobile: photo sits below the copy. md+: photo fills the banner, burger on the right. */}
      <div className="relative order-2 aspect-[3/2] md:absolute md:inset-0 md:aspect-auto">
        <img
          src="/images/hero-1920.webp"
          srcSet="/images/hero-960.webp 960w, /images/hero-1920.webp 1920w"
          sizes="100vw"
          width={1920}
          height={880}
          alt="Sesame burger and golden fries on a wooden board in warm restaurant light"
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-[70%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,rgba(5,5,5,0)_35%)] md:bg-[linear-gradient(90deg,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.82)_32%,rgba(5,5,5,0.15)_62%,rgba(5,5,5,0)_100%)]"
        />
      </div>

      <div className="relative order-1 mx-auto flex w-full max-w-[1400px] items-center px-4 pt-12 pb-8 md:min-h-[480px] md:px-6 md:py-20 lg:min-h-[520px] desk:min-h-[560px] desk:px-8 wide:px-12">
        <div className="max-w-[460px]">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">
            Real Ingredients · Freshly Made
          </p>
          <h1
            id="hero-title"
            className="mt-4 font-display text-[38px] leading-[1.04] font-extrabold tracking-[-1px] md:text-[44px] desk:text-[52px] desk:tracking-[-1.4px]"
          >
            <span className="block text-white">Bigger Taste</span>
            <span className="block text-brand">Better Moments</span>
          </h1>
          <p className="mt-5 max-w-[400px] text-[15px] leading-relaxed text-white/80 desk:text-[16px]">
            From juicy burgers to crispy fries, we serve fresh, delicious food made for every craving.
          </p>
          <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-8")}>
            Order Now
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none absolute top-[17%] right-[33%] hidden -rotate-6 font-hand text-[30px] leading-none text-white md:block desk:text-[34px]"
      >
        Freshly Made
        <svg viewBox="0 0 60 40" className="mt-1 ml-auto h-8 w-12 rotate-6 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 4c18 2 34 10 44 28" />
          <path d="M38 30l10 3 2-11" />
        </svg>
      </p>
    </section>
  );
}
