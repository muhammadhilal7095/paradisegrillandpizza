import { BestSellersSection } from "../components/home/BestSellersSection";
import { CategorySection } from "../components/home/CategorySection";
import { HeroSection } from "../components/home/HeroSection";
import { RestaurantInfoSection } from "../components/home/RestaurantInfoSection";
import { ReviewsSection } from "../components/home/ReviewsSection";
import { SpecialOffersSection } from "../components/home/SpecialOffersSection";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <BestSellersSection />
      <SpecialOffersSection />
      <ReviewsSection />
      <RestaurantInfoSection />
    </main>
  );
}
