import { formatPrice, type Product } from "../../data/menu";
import { AddToCartButton } from "../ui/AddToCartButton";

interface ProductCardProps {
  product: Product;
  headingLevel?: "h3" | "h2";
  /** Compact cards (sides, drinks, desserts) drop the description. */
  variant?: "full" | "compact";
}

export function ProductCard({ product, headingLevel: Heading = "h3", variant = "full" }: ProductCardProps) {
  const compact = variant === "compact";
  return (
    <article
      id={product.id}
      className="group flex scroll-mt-40 flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-200 hover:shadow-[0_10px_28px_-16px_rgba(17,17,17,0.25)]"
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
      <div className={`flex flex-1 flex-col ${compact ? "p-2.5" : "p-3.5"}`}>
        <Heading className={`leading-snug font-semibold text-ink ${compact ? "text-[13px]" : "text-[14px]"}`}>
          {product.name}
        </Heading>
        {!compact && product.description && (
          <p className="mt-1 text-[12px] leading-relaxed text-muted">{product.description}</p>
        )}
        <p className={`mt-auto font-bold text-brand-dark ${compact ? "pt-1.5 text-[14px]" : "pt-3 text-[15px]"}`}>
          {formatPrice(product.price)}
        </p>
        <AddToCartButton
          item={{ id: product.id, name: product.name, price: product.price, image: product.image }}
          size={compact ? "xs" : "sm"}
          className={compact ? "mt-2 w-full" : "mt-2.5 w-full"}
        />
      </div>
    </article>
  );
}
