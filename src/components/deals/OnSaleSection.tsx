import { useMenu } from "../../context/menuStore";
import { ProductCard } from "../menu/ProductCard";
import { SectionHeading } from "../ui/SectionHeading";

/** Products the POS has on sale right now (an active discount on the product). Hidden when there are none. */
export function OnSaleSection({ limit, tone = "light" }: { limit?: number; tone?: "light" | "mist" }) {
  const { products } = useMenu();
  const onSale = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
  if (onSale.length === 0) return null;
  const shown = limit ? onSale.slice(0, limit) : onSale;

  return (
    <section id="on-sale" aria-labelledby="on-sale-title" className={`scroll-mt-20 py-16 md:py-20 ${tone === "mist" ? "bg-mist" : "bg-white"}`}>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <SectionHeading
          id="on-sale-title"
          eyebrow="On Sale"
          title={
            <>
              Prices <em>Cut</em> Today
            </>
          }
          description={`${onSale.length} ${onSale.length === 1 ? "item is" : "items are"} on sale right now. Grab ${onSale.length === 1 ? "it" : "them"} while the offer lasts.`}
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {shown.map((product) => (
            <li key={product.id} className="flex [&>article]:flex-1">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
