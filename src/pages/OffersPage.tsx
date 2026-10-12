import { OfferCard } from "../components/menu/OfferCard";
import { OFFERS } from "../data/menu";

export function OffersPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-12 md:px-6 md:py-16 desk:px-8 wide:px-12">
      <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Today's Deals</p>
      <h1 className="mt-2 font-display text-[32px] leading-tight font-extrabold tracking-[-0.8px] text-ink md:text-[40px]">
        Special Offers
      </h1>
      <p className="mt-3 max-w-xl text-[15px] text-muted">Grab the best deals and enjoy more for less.</p>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {OFFERS.map((offer) => (
          <li key={offer.productId} className="flex">
            <OfferCard offer={offer} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </main>
  );
}
