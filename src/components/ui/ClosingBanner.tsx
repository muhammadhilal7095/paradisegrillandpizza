import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "./button";

interface ClosingBannerProps {
  titleId: string;
  /** Decorative handwritten slogan, one entry per line. */
  slogan: string[];
  /** Slogan lines from this index on are red. */
  sloganAccentFrom?: number;
  titleTop: string;
  /** Red second heading line. */
  titleBottom: string;
  description?: string;
  image: { src: string; srcSet?: string; width: number; height: number; alt: string };
}

/**
 * Dark end-of-page banner: handwritten slogan (left), food photo (centre), heading + Order Now (right).
 * Stacks on small screens. The photo's edges are faded into the black background.
 */
export function ClosingBanner({ titleId, slogan, sloganAccentFrom = slogan.length, titleTop, titleBottom, description, image }: ClosingBannerProps) {
  return (
    <section aria-labelledby={titleId} className="relative isolate overflow-hidden bg-deep text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_70%_at_50%_55%,rgba(242,27,45,0.16),transparent_70%)]"
      />
      <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-4 py-12 md:grid-cols-[1fr_1.2fr] md:px-6 lg:grid-cols-[0.8fr_1.3fr_1fr] lg:py-6 desk:px-8 wide:px-12">
        {/* Decorative — the heading on the right carries the message. */}
        <div aria-hidden="true" className="flex items-center justify-center gap-3 lg:justify-end">
          <p className="-rotate-6 text-center font-hand text-[34px] leading-[0.95] lg:text-left lg:text-[44px]">
            {slogan.map((line, i) => (
              <span key={i} className={`lg:block ${i >= sloganAccentFrom ? "text-brand" : ""}`}>
                {line}{" "}
              </span>
            ))}
          </p>
          <svg viewBox="0 0 70 50" className="hidden h-12 w-16 shrink-0 text-white/80 lg:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 10c20-6 42 2 56 26" />
            <path d="M50 34l11 4 1-12" />
          </svg>
        </div>

        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 55vw, 100vw"
          width={image.width}
          height={image.height}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="mx-auto w-full max-w-[540px] object-contain [mask-image:radial-gradient(ellipse_closest-side,#000_72%,transparent_100%)]"
        />

        <div className="flex flex-col items-center text-center md:col-span-2 lg:col-span-1 lg:items-start lg:text-left">
          <h2 id={titleId} className="font-display text-[32px] leading-[1.05] font-extrabold tracking-[-0.6px] md:text-[38px] desk:text-[42px]">
            <span className="block">{titleTop}</span>
            <span className="block text-brand">{titleBottom}</span>
          </h2>
          {description && <p className="mt-3 text-[14px] text-white/80">{description}</p>}
          <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-6")}>
            Order Now
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
