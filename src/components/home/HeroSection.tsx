import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";
import { PageHero } from "../ui/PageHero";

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
      annotation="Freshly Made"
    >
      <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-8")}>
        Order Now
        <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </PageHero>
  );
}
