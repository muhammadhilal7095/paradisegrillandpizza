import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MenuStatusNotice } from "../components/menu/MenuStatusNotice";
import { DealGrid } from "../components/menu/DealCard";
import { ReminderStrip } from "../components/offers/ReminderStrip";
import { buttonClasses } from "../components/ui/button";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ORDER_PATH } from "../config/site";
import { useMenu } from "../context/menuStore";
import { heroImage } from "../data/menu";

const container = "mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12";

/** Shows the products in the portal's deal categories ("Meal Deals", "Offers", "Combos"…). */
export function OffersPage() {
  const { status, dealProducts } = useMenu();

  return (
    <main>
      <PageHero
        titleId="offers-title"
        eyebrow="Special Offers & Deals"
        titleTop="More Food,"
        titleBottom="Less to Pay"
        description="Meal deals and bundles from our kitchen, added straight to your order."
        image={heroImage("deals", "Sliced pizzas on a dark table")}
      >
        <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-7")}>
          Order Now
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </PageHero>

      <section aria-labelledby="deals-title" className="bg-white py-16 md:py-20">
        <div className={container}>
          <SectionHeading
            id="deals-title"
            align="center"
            eyebrow="Save on Favourites"
            title={
              <>
                Current <em>Deals</em>
              </>
            }
            description="Our deals and bundles, straight from today's menu."
          />
          <div className="mt-10">
            {status !== "ready" ? (
              <MenuStatusNotice skeletonCount={4} />
            ) : dealProducts.length > 0 ? (
              <DealGrid products={dealProducts} />
            ) : (
              <div className="flex flex-col items-center text-center">
                <p className="font-display text-[22px] font-bold text-ink">No deals running right now</p>
                <p className="mt-2 max-w-md text-[15px] text-muted">New offers are added regularly. In the meantime, the full menu is ready when you are.</p>
                <Link to="/menu" className={buttonClasses("primary", "md", "mt-6")}>
                  Browse the menu
                  <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
          <div className="mt-12">
            <ReminderStrip />
          </div>
        </div>
      </section>
    </main>
  );
}
