import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ChefHat, MapPin, Navigation, Wheat } from "lucide-react";
import { CONTACT } from "../../config/contact";
import { heroImage } from "../../data/menu";
import { buttonClasses } from "../ui/button";

const IMAGE = heroImage("about", "Chef cooking over high flames in a restaurant kitchen");

const POINTS = [
  { icon: Wheat, title: "Fresh every day", note: "Prepared in our kitchen" },
  { icon: ChefHat, title: "Cooked to order", note: "Never pre-made" },
  { icon: BadgeCheck, title: "Halal", note: "As on our logo" },
];

/** About page banner: who we are, with a "find us" card on large screens. */
export function AboutHero() {
  const address = CONTACT.address.lines.join(", ");
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Paradise Grill and Pizza, ${address}`)}`;

  return (
    <section aria-labelledby="about-title" className="relative isolate overflow-hidden bg-deep text-white">
      <img
        src={IMAGE.large}
        srcSet={`${IMAGE.small} 960w, ${IMAGE.large} 1920w`}
        sizes="100vw"
        width={1920}
        height={880}
        alt={IMAGE.alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-[65%_center] [filter:saturate(1.05)_contrast(1.06)] motion-safe:animate-[hero-zoom_14s_ease-out_both]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.8),rgba(5,5,5,0.92))] desk:bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.94)_32%,rgba(5,5,5,0.55)_58%,rgba(5,5,5,0.2)_82%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_40%_70%_at_78%_55%,rgba(224,48,30,0.16),transparent_70%)] desk:block" />

      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-10 px-4 py-10 md:px-6 md:py-14 desk:min-h-[480px] desk:px-8 desk:py-16 wide:px-12">
        <div className="max-w-[580px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.04em] backdrop-blur-sm">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            About Us · Your Neighbourhood Kitchen in Slough
          </p>
          <h1 id="about-title" className="mt-4 font-display text-[38px] leading-[1.02] font-extrabold tracking-[-1px] md:text-[48px] desk:text-[58px] desk:tracking-[-1.6px]">
            <span className="block">Made Fresh.</span>
            <span className="block text-brand">Made With Care.</span>
          </h1>
          <p className="mt-4 max-w-[500px] text-[15px] leading-relaxed text-white/80 md:text-[16px]">
            Paradise Grill and Pizza is a local takeaway on Bath Road, cooking stone-baked pizza, crispy fried chicken, burgers,
            kebabs and curries from scratch, every time you order.
          </p>

          <ul className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:flex sm:gap-0">
            {POINTS.map(({ icon: Icon, title, note }, i) => (
              <li key={title} className={`flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2.5 sm:px-5 sm:first:pl-0 ${i > 0 ? "sm:border-l sm:border-white/15" : ""}`}>
                <Icon size={22} strokeWidth={2} aria-hidden="true" className="shrink-0 text-brand" />
                <span className="leading-tight">
                  <span className="block text-[12px] font-semibold sm:text-[13px]">{title}</span>
                  <span className="block text-[11px] text-white/55">{note}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/menu" className={buttonClasses("primary", "md", "shadow-[0_12px_30px_-10px_rgba(224,48,30,0.8)]")}>
              Explore our menu
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <a href="#story-title" className={buttonClasses("outlineLight", "md")}>
              Our story
            </a>
          </div>
        </div>

        {/* Find us card (large screens) */}
        <div className="hidden w-[300px] shrink-0 rounded-2xl border border-white/15 bg-black/55 p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md desk:block">
          <p className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">Find us</p>
          <p className="mt-3 flex items-start gap-2.5 text-[15px] leading-snug">
            <MapPin size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
            <span>
              <span className="block font-semibold">Paradise Grill and Pizza</span>
              <span className="text-white/75">{address}</span>
            </span>
          </p>
          <a href={directions} target="_blank" rel="noopener noreferrer" className={buttonClasses("outlineLight", "sm", "mt-4 w-full")}>
            <Navigation size={14} strokeWidth={2.2} aria-hidden="true" />
            Get directions
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
