import { formatPrice, hasPricedOptions, startingPrice, isPlaceholderImage, menuImage, PLACEHOLDER_IMG_CLASSES, productImageName, type Product } from "../../data/menu";
import { AddToCartButton } from "../ui/AddToCartButton";
import { fallbackImage } from "./imageFallback";

/**
 * One dish on the menu page, laid out like a printed menu line: details on the left,
 * a square photo on the right with the add button. Built to be scanned quickly.
 */
export function MenuItemRow({ product }: { product: Product }) {
  const image = productImageName(product);
  const options = (product.options?.length ?? 0) > 0;

  return (
    <article
      id={product.id}
      className="group flex h-full scroll-mt-44 gap-4 rounded-2xl border border-line bg-white p-3.5 transition-[border-color,box-shadow] duration-200 hover:border-ink/15 hover:shadow-[0_10px_30px_-18px_rgba(17,17,17,0.35)] md:p-4"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.bestSeller && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-brand-dark uppercase">Popular</span>}
          {product.originalPrice && <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-white uppercase">Offer</span>}
        </div>
        <h3 title={product.name} className="mt-0.5 line-clamp-2 font-display text-[15px] leading-snug font-bold text-ink md:text-[16px]">
          {product.name}
        </h3>
        {product.description && (
          <p title={product.description} className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {product.description}
          </p>
        )}
        <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-3">
          {hasPricedOptions(product) && <span className="text-[12px] font-medium text-muted">from</span>}
          {product.originalPrice ? <span className="sr-only">Now </span> : null}
          <span className={`text-[16px] font-bold ${product.originalPrice ? "text-brand-dark" : "text-ink"}`}>{formatPrice(startingPrice(product))}</span>
          {product.originalPrice ? (
            <>
              <span className="sr-only">, was </span>
              <s className="text-[13px] text-muted">{formatPrice(startingPrice(product, product.originalPrice))}</s>
            </>
          ) : null}
        </p>
      </div>

      <div className="flex w-[104px] shrink-0 flex-col items-center gap-2.5 md:w-[120px]">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-white">
          <img
            src={menuImage(image)}
            alt={product.imageAlt}
            onError={fallbackImage(product)}
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 size-full transition-transform duration-300 group-hover:scale-[1.05] ${
              isPlaceholderImage(menuImage(image)) ? PLACEHOLDER_IMG_CLASSES.join(" ") : "object-contain"
            }`}
          />
        </div>
        <AddToCartButton product={product} label={options ? "Choose" : "Add"} plus={!options} size="sm" className="w-full" />
      </div>
    </article>
  );
}
