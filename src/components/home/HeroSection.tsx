import { Link } from "react-router-dom";
import { ArrowRight, Heart, Leaf, Truck } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";
import { PageHero } from "../ui/PageHero";

const FEATURES = [
  { icon: Leaf, title: "Fresh Ingredients", note: "100% Quality" },
  { icon: Heart, title: "Hygienic & Safe", note: "Your Health Matters" },
  { icon: Truck, title: "Fast Delivery", note: "Hot & Fresh" },
];

export function HeroSection() {
  return (
    <PageHero
      size="lg"
      titleId="hero-title"
      eyebrow="Real Ingredients · Freshly Made"
      titleTop="Bigger Taste"
      titleBottom="Better Moments"
      description="From juicy burgers to crispy fries, we serve fresh, delicious food made for every craving."
      image={{
        small: "/images/hero-960.webp",
        large: "/images/hero-1920.webp",
        width: 1920,
        height: 880,
        alt: "Sesame burger and golden fries on a wooden board in warm restaurant light",
      }}
      decoration={
        <p
          aria-hidden="true"
          className="pointer-events-none absolute right-[4%] bottom-[9%] hidden -rotate-12 text-right font-hand text-[34px] leading-[0.95] text-white md:block desk:text-[42px]"
        >
          Good Food
          <br />
          Good Mood
          <svg viewBox="0 0 120 16" className="mt-1 ml-auto h-3 w-28 text-brand" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
            <path d="M4 12C40 4 80 2 116 5" />
          </svg>
        </p>
      }
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={ORDER_PATH} className={buttonClasses("primary", "md")}>
          Order Now
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
        <Link to="/menu" className={buttonClasses("outlineLight", "md")}>
          View Menu
        </Link>
      </div>

      <ul className="mt-9 grid grid-cols-3 gap-2 sm:flex sm:gap-0">
        {FEATURES.map(({ icon: Icon, title, note }, i) => (
          <li
            key={title}
            className={`flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2.5 sm:px-4 sm:first:pl-0 ${
              i > 0 ? "sm:border-l sm:border-white/20" : ""
            }`}
          >
            <Icon size={22} strokeWidth={2} className="shrink-0 text-brand" aria-hidden="true" />
            <span className="leading-tight">
              <span className="block text-[12px] font-semibold text-white sm:text-[13px]">{title}</span>
              <span className="block text-[11px] text-white/60">{note}</span>
            </span>
          </li>
        ))}
      </ul>
    </PageHero>
  );
}
