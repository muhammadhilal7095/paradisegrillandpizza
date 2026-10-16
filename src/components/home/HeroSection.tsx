import { Link } from "react-router-dom";
import { ArrowRight, Bike, Flame, Wheat } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { heroImage } from "../../data/menu";
import { buttonClasses } from "../ui/button";
import { PageHero } from "../ui/PageHero";

const FEATURES = [
  { icon: Wheat, title: "Fresh Dough Daily", note: "Hand-stretched" },
  { icon: Flame, title: "Flame-Grilled", note: "Cooked to order" },
  { icon: Bike, title: "Collect or Delivery", note: "Hot to your door" },
];

export function HeroSection() {
  return (
    <PageHero
      size="lg"
      titleId="hero-title"
      eyebrow="Pizza · Peri Peri · Kebabs · Curries"
      titleTop="Stone-Baked Pizza."
      titleBottom="Flame-Grilled Taste."
      description="Hand-stretched pizza, peri peri chicken, freshly carved kebabs and slow-cooked curries, made fresh when you order."
      image={heroImage("home", "Pizza with bubbling mozzarella baking in a flaming wood-fired oven")}
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
