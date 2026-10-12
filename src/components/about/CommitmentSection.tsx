import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { COLLAGE, COMMITMENT_TEXT } from "../../data/about";
import { buttonClasses } from "../ui/button";

// Gentle magazine tilt + overlap from 1024px up; flat side-by-side below.
const TILT = ["lg:-rotate-[5deg] lg:translate-y-3", "lg:rotate-[2deg] lg:-translate-y-2 lg:z-10", "lg:-rotate-[3deg] lg:translate-y-4"];

export function CommitmentSection() {
  return (
    <section aria-labelledby="commitment-title" className="overflow-hidden bg-deep py-16 text-white md:py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 md:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 desk:px-8">
        <div className="text-center lg:text-left">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Our Commitment</p>
          <h2
            id="commitment-title"
            className="mt-2 font-display text-[28px] leading-[1.1] font-extrabold tracking-[-0.6px] md:text-[32px] desk:text-[36px]"
          >
            <span className="block">Better Food</span>
            <span className="block">
              for <span className="text-brand">Better Moments</span>
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[30rem] text-[14px] leading-[1.65] text-white/80 lg:mx-0">{COMMITMENT_TEXT}</p>
          <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-7")}>
            Order Now
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile: swipeable strip. md: three across. lg: tilted, overlapping collage. */}
        <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:gap-0 [&::-webkit-scrollbar]:hidden">
          {COLLAGE.map((photo, i) => (
            <li key={photo.caption} className={`relative w-[68%] shrink-0 snap-center md:w-auto ${i > 0 ? "lg:-ml-6" : ""} ${TILT[i]}`}>
              <figure className="rounded-lg bg-white p-2 pb-0 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] transition-transform duration-300 motion-safe:hover:-translate-y-1">
                <img
                  src={photo.image}
                  alt={photo.alt}
                  width={480}
                  height={380}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[6/5] w-full rounded object-cover"
                />
                <figcaption className="py-2.5 text-center text-[13px] font-semibold text-ink">{photo.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
