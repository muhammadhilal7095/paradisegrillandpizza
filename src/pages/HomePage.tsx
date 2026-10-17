import { BestSellersSection } from "../components/home/BestSellersSection";
import { CategorySection } from "../components/home/CategorySection";
import { HeroSection } from "../components/home/HeroSection";
import { RestaurantInfoSection } from "../components/home/RestaurantInfoSection";
import { ReviewsSection } from "../components/home/ReviewsSection";
import { SpecialOffersSection } from "../components/home/SpecialOffersSection";
import { OnSaleSection } from "../components/deals/OnSaleSection";
import { SpecialDealsSection } from "../components/deals/SpecialDealsSection";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <SpecialDealsSection limit={3} showAllLink />
      <BestSellersSection />
      <OnSaleSection limit={4} />
      <SpecialOffersSection />
      <ReviewsSection />
      <RestaurantInfoSection />
    </main>
  );
}
