import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ComboDealCard, OfferCard } from "../components/menu/OfferCard";
import { PromotionalBanner } from "../components/offers/PromotionalBanner";
import { ReminderStrip } from "../components/offers/ReminderStrip";
import { buttonClasses } from "../components/ui/button";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ORDER_PATH } from "../config/site";
import { liveOffers } from "../data/menu";
import { livePromotions } from "../data/promotions";

const container = "mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12";

export function OffersPage() {
  const deals = liveOffers("discount");
  const combos = liveOffers("combo");
  const promos = livePromotions();

  return (
    <main>
      <PageHero
        titleId="offers-title"
        eyebrow="Hot Deals & Savings"
        titleTop="Offers That"
        titleBottom="Hit Different"
        description="Big flavour. Bigger savings. Your favourites for less."
        image={{
          small: "/images/offers-hero-960.webp",
          large: "/images/offers-hero-1920.webp",
          width: 1920,
          height: 700,
          alt: "Burger with lettuce, tomato and red onion beside a cup of chunky fries",
        }}
        annotation="Freshly Made Deals"
      >
        <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-7")}>
          Order Now
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </PageHero>

      {deals.length > 0 && (
        <section aria-labelledby="exclusive-title" className="bg-white py-16 md:py-20">
          <div className={container}>
            <SectionHeading
              id="exclusive-title"
              align="center"
              eyebrow="Special for You"
              title={
                <>
                  Exclusive <em>Deals</em>
                </>
              }
              description="Freshly made favourites at prices worth celebrating."
            />
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {deals.map((offer) => (
                <li key={offer.productId} className="flex">
                  <OfferCard offer={offer} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {combos.length > 0 && (
        <section
          aria-labelledby="combos-title"
          className="bg-deep bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[18px_18px] py-16 md:py-20"
        >
          <div className={container}>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                id="combos-title"
                tone="dark"
                eyebrow="Value Packs"
                title={
                  <>
                    Combo <em>Deals</em>
                  </>
                }
                description="More to share. More to enjoy. Great food, better together."
              />
              <Link to="/menu?category=combos" className={buttonClasses("outlineLight", "md", "self-start md:self-auto")}>
                View All Combos
                <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {combos.map((offer) => (
                <li key={offer.productId} className="flex">
                  <ComboDealCard offer={offer} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="specials-title" className="bg-white py-16 md:py-20">
        <div className={container}>
          {promos.length > 0 && (
            <>
              <SectionHeading
                id="specials-title"
                align="center"
                eyebrow="Limited Time"
                title={
                  <>
                    Limited-Time <em>Specials</em>
                  </>
                }
                description="Don't miss these tasty offers. For a limited time only."
              />
              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                {promos.map((promo) => (
                  <PromotionalBanner key={promo.id} promo={promo} />
                ))}
              </div>
            </>
          )}
          <div className={promos.length > 0 ? "mt-10" : ""}>
            <ReminderStrip />
          </div>
        </div>
      </section>
    </main>
  );
}
