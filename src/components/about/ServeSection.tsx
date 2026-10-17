import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SERVE } from "../../data/about";
import { buttonClasses } from "../ui/button";
import { SectionHeading } from "../ui/SectionHeading";

/** "What we serve": photo cards for the main kinds of food, linking to the menu. */
export function ServeSection() {
  return (
    <section aria-labelledby="serve-title" className="bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="serve-title"
            eyebrow="Our Food"
            title={
              <>
                What We <em>Serve</em>
              </>
            }
            description="A menu full of favourites, all cooked fresh in our Slough kitchen."
          />
          <Link to="/menu" className={buttonClasses("outlineDark", "md", "self-start bg-white md:self-auto")}>
            See the full menu
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {SERVE.map((item) => (
            <li key={item.title}>
              <Link to="/menu" className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-white p-3 transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(17,17,17,0.35)] md:p-4">
                <img
                  src={`/images/menu/${item.image}-540.webp`}
                  alt={item.alt}
                  width={540}
                  height={540}
                  loading="lazy"
                  decoding="async"
                  className="size-24 shrink-0 rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.04] md:size-28"
                />
                <span className="min-w-0">
                  <span className="block font-display text-[17px] leading-snug font-bold text-ink transition-colors group-hover:text-brand">{item.title}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-muted">{item.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
