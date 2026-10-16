import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CommitmentSection } from "../components/about/CommitmentSection";
import { StatsSection } from "../components/about/StatsSection";
import { StorySection } from "../components/about/StorySection";
import { ValuesSection } from "../components/about/ValuesSection";
import { buttonClasses } from "../components/ui/button";
import { ClosingBanner } from "../components/ui/ClosingBanner";
import { PageHero } from "../components/ui/PageHero";

import { heroImage, menuImage } from "../data/menu";

export function AboutPage() {
  return (
    <main>
      <PageHero
        titleId="about-title"
        eyebrow="About Us"
        titleTop="Made Fresh."
        titleBottom="Made With Care."
        description="Paradise Grill and Pizza is a neighbourhood kitchen serving stone-baked pizza, flame-grilled chicken, kebabs and curries, cooked fresh for every order."
        image={heroImage("about", "Freshly baked pizzas on a dark table")}
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
          src: menuImage("pizza-night-for-two", 1080),
          width: 1080,
          height: 1080,
          alt: "Pizzas with different toppings on a dark table",
        }}
      />
    </main>
  );
}
