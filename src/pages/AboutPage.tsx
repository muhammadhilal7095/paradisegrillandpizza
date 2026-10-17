import { AboutHero } from "../components/about/AboutHero";
import { FaqSection } from "../components/about/FaqSection";
import { ProcessSection } from "../components/about/ProcessSection";
import { ServeSection } from "../components/about/ServeSection";
import { StorySection } from "../components/about/StorySection";
import { ValuesSection } from "../components/about/ValuesSection";
import { VisitSection } from "../components/about/VisitSection";

export function AboutPage() {
  return (
    <main>
      <AboutHero />

      <StorySection />
      <ServeSection />
      <ValuesSection />
      <ProcessSection />
      <VisitSection />
      <FaqSection />
    </main>
  );
}
