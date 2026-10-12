import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BEST_SELLERS } from "../../data/menu";
import { ProductCard } from "../menu/ProductCard";
import { buttonClasses } from "../ui/button";
import { SectionHeading } from "../ui/SectionHeading";

export function BestSellersSection() {
  return (
    <section aria-labelledby="best-sellers-title" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="best-sellers-title"
            eyebrow="Popular Menu"
            title={
              <>
                Our <em>Best Sellers</em>
              </>
            }
            description="Loved by our customers. Freshly made. Always delicious."
          />
          <Link to="/menu" className={buttonClasses("outlineDark", "md", "self-start md:self-auto")}>
            View Full Menu
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 xs:grid-cols-2 md:gap-4 md:grid-cols-3 desk:grid-cols-6">
          {BEST_SELLERS.map((product) => (
            <li key={product.id} className="flex [&>article]:flex-1">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
