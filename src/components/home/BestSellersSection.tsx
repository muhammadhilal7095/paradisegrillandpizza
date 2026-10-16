import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMenu } from "../../context/menuStore";
import { ProductCard } from "../menu/ProductCard";
import { buttonClasses } from "../ui/button";
import { SectionHeading } from "../ui/SectionHeading";

export function BestSellersSection() {
  const { bestSellers } = useMenu();
  if (bestSellers.length === 0) return null;
  return (
    <section aria-labelledby="best-sellers-title" className="bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="best-sellers-title"
            eyebrow="Customer Favourites"
            title={
              <>
                Our Most <em>Popular</em>
              </>
            }
            description="The dishes our regulars order again and again."
          />
          <Link to="/menu" className={buttonClasses("outlineDark", "md", "self-start bg-white md:self-auto")}>
            View Full Menu
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {bestSellers.slice(0, 8).map((product) => (
            <li key={product.id} className="flex [&>article]:flex-1">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
