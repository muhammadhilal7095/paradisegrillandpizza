import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CommitmentSection } from "../components/about/CommitmentSection";
import { StatsSection } from "../components/about/StatsSection";
import { StorySection } from "../components/about/StorySection";
import { ValuesSection } from "../components/about/ValuesSection";
import { buttonClasses } from "../components/ui/button";
import { ClosingBanner } from "../components/ui/ClosingBanner";
import { PageHero } from "../components/ui/PageHero";

export function AboutPage() {
  return (
    <main>
      <PageHero
        titleId="about-title"
        eyebrow="About Us"
        titleTop="More Than"
        titleBottom="Just Burgers"
        description="At BurgerBite, we believe good food brings people together. We serve fresh, delicious and high-quality meals made with love."
        image={{
          small: "/images/about-hero-960.webp",
          large: "/images/about-hero-1920.webp",
          width: 1920,
          height: 700,
          alt: "Sesame burger with lettuce, tomato and cheese on a wooden board",
        }}
        annotation="Good Food, Good People"
      >
        <Link to="/menu" className={buttonClasses("primary", "md", "mt-7")}>
          Our Menu
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </PageHero>

      <StorySection />
      <ValuesSection />
      <CommitmentSection />
      <StatsSection />

      <ClosingBanner
        titleId="our-story-cta-title"
        slogan={["Good Food", "Creates Better", "Moments"]}
        sloganAccentFrom={2}
        titleTop="Be Part of"
        titleBottom="Our Story"
        image={{
          src: "/images/about-banner.webp",
          width: 1200,
          height: 800,
          alt: "Burger in a dark red bun with melted cheese and fresh greens",
        }}
      />
    </main>
  );
}
