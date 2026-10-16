import { formatPrice, hasPricedOptions, menuImage, menuSrcSet, productImageName, type Product } from "../../data/menu";
import { AddToCartButton } from "../ui/AddToCartButton";
import { fallbackImage } from "./imageFallback";
import { isPlaceholderImage, PLACEHOLDER_IMG_CLASSES } from "../../data/menu";

interface ProductCardProps {
  product: Product;
  headingLevel?: "h3" | "h2";
  /** Compact cards (drinks, desserts) drop the description. */
  variant?: "full" | "compact";
}

export function ProductCard({ product, headingLevel: Heading = "h3", variant = "full" }: ProductCardProps) {
  const compact = variant === "compact";
  const image = productImageName(product);
  return (
    <article
      id={product.id}
      className="group flex scroll-mt-40 flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-200 hover:shadow-[0_10px_28px_-16px_rgba(17,17,17,0.25)]"
    >
      <div className="relative aspect-square overflow-hidden border-b border-line bg-white">
        <img
          src={menuImage(image)}
          srcSet={menuSrcSet(image)}
          sizes="(min-width: 1200px) 260px, (min-width: 768px) 30vw, 50vw"
          alt={product.imageAlt}
          onError={fallbackImage(product)}
          width={1080}
          height={1080}
          loading="lazy"
          decoding="async"
          className={`size-full transition-transform duration-300 group-hover:scale-[1.04] ${isPlaceholderImage(menuImage(image)) ? PLACEHOLDER_IMG_CLASSES.join(" ") : "object-contain"}`}
        />
        {product.tag && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink">
            {product.tag}
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-3" : "p-3.5 md:p-4"}`}>
        <Heading className={`font-display leading-snug font-bold text-ink ${compact ? "text-[14px]" : "text-[15px] md:text-[16px]"}`}>
          {product.name}
        </Heading>
        {!compact && product.description && (
          // One line on the card; the full text is the tooltip and is still read in full by screen readers.
          <p title={product.description} className="mt-1 truncate text-[13px] leading-relaxed text-muted">
            {product.description}
          </p>
        )}
        <p className={`mt-auto font-bold text-ink ${compact ? "pt-2 text-[15px]" : "pt-3 text-[16px]"}`}>
          {hasPricedOptions(product) && <span className="mr-1 text-[12px] font-medium text-muted">from</span>}
          {product.originalPrice ? <span className="sr-only">Now </span> : null}
          <span className={product.originalPrice ? "text-brand-dark" : ""}>{formatPrice(product.price)}</span>
          {product.originalPrice ? (
            <>
              <span className="sr-only">, was </span>
              <s className="ml-1.5 text-[13px] font-medium text-muted">{formatPrice(product.originalPrice)}</s>
            </>
          ) : null}
        </p>
        <AddToCartButton product={product} size="sm" className={compact ? "mt-2.5 w-full" : "mt-3 w-full"} />
      </div>
    </article>
  );
}
