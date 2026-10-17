import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Camera, Pause, Play } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { heroImage } from "../../data/menu";
import { buttonClasses } from "../ui/button";

/** Slides: wide food photos already used across the site (public/images/hero). */
const SLIDES = [
  { name: "pizza", label: "Pizza", alt: "Pepperoni pizza with melted mozzarella" },
  { name: "deals", label: "Fried Chicken", alt: "Basket of crispy fried chicken with a dipping sauce" },
  { name: "menu", label: "Burgers", alt: "Crispy chicken burger with fries and ketchup" },
  { name: "about-oven", label: "From the Oven", alt: "Pizza baking in a wood-fired oven" },
  { name: "kebabs", label: "Doner", alt: "Doner meat turning on a rotisserie" },
].map((s) => ({ ...s, ...heroImage(s.name, s.alt) }));

const SLIDE_MS = 5500;

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Gallery banner: a slow crossfading slideshow with a gentle zoom on each photo.
 * Pauses on request (and starts paused for people who prefer reduced motion).
 */
export function GalleryHero({ photoCount }: { photoCount: number }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  const current = SLIDES[index];

  return (
    <section aria-labelledby="gallery-title" aria-roledescription="carousel" className="relative isolate overflow-hidden bg-deep text-white">
      {/* Slides */}
      <div className="absolute inset-0 -z-20" aria-live="off">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          return (
            <img
              // The key changes each time a slide becomes active, restarting its zoom.
              key={active ? `${slide.name}-${index}` : slide.name}
              src={slide.large}
              srcSet={`${slide.small} 960w, ${slide.large} 1920w`}
              sizes="100vw"
              width={1920}
              height={880}
              alt={active ? slide.alt : ""}
              aria-hidden={!active}
              fetchPriority={i === 0 ? "high" : "low"}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 size-full object-cover object-[70%_center] [filter:saturate(1.08)_contrast(1.05)] transition-opacity duration-[1400ms] ease-in-out ${
                active ? "opacity-100 motion-safe:animate-[gallery-kenburns_7s_ease-out_both]" : "opacity-0"
              }`}
            />
          );
        })}
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.78),rgba(5,5,5,0.9))] desk:bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.92)_30%,rgba(5,5,5,0.45)_58%,rgba(5,5,5,0.1)_80%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_40%_70%_at_78%_55%,rgba(224,48,30,0.18),transparent_70%)] desk:block" />

      <div className="mx-auto flex max-w-[1400px] flex-col justify-center px-4 py-10 md:px-6 md:py-14 desk:min-h-[460px] desk:px-8 desk:py-16 wide:px-12">
        <div className="max-w-[560px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.04em] backdrop-blur-sm">
            <Camera size={13} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
            Our Gallery · {photoCount} Photos
          </p>
          <h1 id="gallery-title" className="mt-4 font-display text-[38px] leading-[1.02] font-extrabold tracking-[-1px] md:text-[48px] desk:text-[58px] desk:tracking-[-1.6px]">
            <span className="block">A Taste of</span>
            <span className="block text-brand">Paradise.</span>
          </h1>
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-white/80 md:text-[16px]">
            Stone-baked pizza, crispy fried chicken, loaded burgers and freshly carved doner: a look at the food we cook fresh every day in our
            Slough kitchen.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#photos" className={buttonClasses("primary", "md", "shadow-[0_12px_30px_-10px_rgba(224,48,30,0.8)]")}>
              Browse photos
              <ArrowDown size={17} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <Link to={ORDER_PATH} className={buttonClasses("outlineLight", "md")}>
              Order Now
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Slide controls */}
        <div className="mt-10 flex items-center gap-3 desk:absolute desk:right-8 desk:bottom-8 desk:mt-0 wide:right-12">
          <p className="min-w-[110px] text-[12px] font-semibold tracking-[0.12em] text-white/80 uppercase" aria-live="polite">
            {current.label}
          </p>
          <ol className="flex items-center gap-1.5">
            {SLIDES.map((slide, i) => (
              <li key={slide.name}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}: ${slide.label}`}
                  aria-current={i === index}
                  className="relative flex h-8 items-center"
                >
                  <span className={`block h-1 overflow-hidden rounded-full bg-white/25 transition-all duration-300 ${i === index ? "w-10" : "w-4 hover:bg-white/50"}`}>
                    {i === index && (
                      <span
                        key={`${index}-${playing}`}
                        className={`block h-full bg-brand ${playing ? "motion-safe:animate-[slide-progress_linear_both]" : "w-full"}`}
                        style={{ animationDuration: `${SLIDE_MS}ms` }}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50"
          >
            {playing ? <Pause size={14} strokeWidth={2.4} /> : <Play size={14} strokeWidth={2.4} />}
          </button>
        </div>
      </div>
    </section>
  );
}
