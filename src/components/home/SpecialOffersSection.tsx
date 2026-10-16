import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMenu } from "../../context/menuStore";
import { DealGrid } from "../menu/DealCard";
import { buttonClasses } from "../ui/button";
import { SectionHeading } from "../ui/SectionHeading";

/** Products from the portal's deal categories ("Meal Deals", "Offers"…). Hidden when there are none. */
export function SpecialOffersSection() {
  const { dealProducts } = useMenu();
  if (dealProducts.length === 0) return null;

  return (
    <section aria-labelledby="offers-title" className="relative isolate overflow-hidden bg-deep py-16 md:py-24">
      {/* Fine dot texture plus a soft red glow behind the cards. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[18px_18px]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_30%_70%,rgba(224,48,30,0.22),transparent_70%)]" />
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="offers-title"
            tone="dark"
            eyebrow="Today's Deals"
            title={
              <>
                Special Offers <em>Just for You</em>
              </>
            }
            description={`${dealProducts.length} ${dealProducts.length === 1 ? "deal" : "deals"} on our favourites, for one, two or the whole family.`}
          />
          <Link to="/offers" className={buttonClasses("outlineLight", "md", "self-start md:self-auto")}>
            View All Offers
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 md:mt-12">
          <DealGrid products={dealProducts} limit={4} />
        </div>
      </div>
    </section>
  );
}
