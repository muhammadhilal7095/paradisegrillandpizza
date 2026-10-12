import { formatPrice, type Product } from "../../data/menu";
import { AddToCartButton } from "../ui/AddToCartButton";

interface ProductCardProps {
  product: Product;
  headingLevel?: "h3" | "h2";
}

export function ProductCard({ product, headingLevel: Heading = "h3" }: ProductCardProps) {
  return (
    <article
      id={product.id}
      className="group flex scroll-mt-24 flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-200 hover:shadow-[0_10px_28px_-16px_rgba(17,17,17,0.25)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-mist">
        <img
          src={product.image}
          alt={product.imageAlt}
          width={520}
          height={390}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <Heading className="font-display text-[15px] leading-snug font-bold text-ink">{product.name}</Heading>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{product.description}</p>
        <p className="mt-auto pt-3 text-[16px] font-bold text-brand">{formatPrice(product.price)}</p>
        <AddToCartButton
          item={{ id: product.id, name: product.name, price: product.price, image: product.image }}
          className="mt-2.5 w-full"
        />
      </div>
    </article>
  );
}
