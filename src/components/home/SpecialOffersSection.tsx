import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { liveOffers } from "../../data/menu";
import { OfferCard } from "../menu/OfferCard";
import { buttonClasses } from "../ui/button";
import { SectionHeading } from "../ui/SectionHeading";

export function SpecialOffersSection() {
  return (
    <section
      aria-labelledby="offers-title"
      className="bg-deep bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[18px_18px] py-16 md:py-20"
    >
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
            description="Grab the best deals and enjoy more for less. Don't miss out!"
          />
          <Link to="/offers" className={buttonClasses("outlineLight", "md", "self-start md:self-auto")}>
            View All Offers
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {liveOffers("discount").slice(0, 4).map((offer) => (
            <li key={offer.productId} className="flex">
              <OfferCard offer={offer} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
