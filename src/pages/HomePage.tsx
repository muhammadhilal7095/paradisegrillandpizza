import { BestSellersSection } from "../components/home/BestSellersSection";
import { CategorySection } from "../components/home/CategorySection";
import { HeroSection } from "../components/home/HeroSection";
import { PromoBanner } from "../components/home/PromoBanner";
import { SpecialOffersSection } from "../components/home/SpecialOffersSection";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <SpecialOffersSection />
      <BestSellersSection />
      <PromoBanner />
    </main>
  );
}
