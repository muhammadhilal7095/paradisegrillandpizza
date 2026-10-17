import { ShoppingBag, Tag } from "lucide-react";
import { formatPrice, formatShortPrice, hasPricedOptions, startingPrice, isPlaceholderImage, menuImage, PLACEHOLDER_IMG_CLASSES, productImageName, type Product } from "../../data/menu";
import { AddToCartButton } from "../ui/AddToCartButton";
import { fallbackImage } from "./imageFallback";

interface DealCardProps {
  product: Product;
  /** "wide": photo left, details right (for one or two deals). "tall": photo on top (for a row of three or more). */
  layout?: "wide" | "tall";
  headingLevel?: "h3" | "h2";
}

/** Feature card for a meal deal: badge, whole photo, two-line title, price block and a full-width order button. */
export function DealCard({ product, layout = "tall", headingLevel: Heading = "h3" }: DealCardProps) {
  const image = productImageName(product);
  const wide = layout === "wide";
  const saving = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <article
      id={product.id}
      className={`group relative flex w-full overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1 ${
        wide ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-white ${wide ? "aspect-square sm:aspect-auto sm:min-h-[300px] sm:w-[44%] sm:self-stretch" : "aspect-square"}`}>
        <img
          src={menuImage(image)}
          alt={product.imageAlt}
          onError={fallbackImage(product)}
          width={1080}
          height={1080}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.04] ${
            isPlaceholderImage(menuImage(image)) ? PLACEHOLDER_IMG_CLASSES.join(" ") : "object-contain"
          }`}
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-white uppercase shadow-[0_4px_12px_rgba(224,48,30,0.35)]">
          <Tag size={12} strokeWidth={2.4} aria-hidden="true" />
          Deal
        </span>
        {saving > 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold text-white">
            Save {formatShortPrice(saving)}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${wide ? "p-5 sm:border-l sm:border-line md:p-6" : "border-t border-line p-4 md:p-5"}`}>
        <Heading
          title={product.name}
          className={`font-display leading-snug font-bold text-ink ${wide ? "line-clamp-3 text-[18px] md:text-[20px]" : "line-clamp-2 text-[16px] md:text-[17px]"}`}
        >
          {product.name}
        </Heading>
        {product.description && (
          <p title={product.description} className={`mt-2 text-[13px] leading-relaxed text-muted ${wide ? "line-clamp-3 md:text-[14px]" : "line-clamp-2"}`}>
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-dashed border-line pt-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">{hasPricedOptions(product) ? "From" : "Deal price"}</p>
              <p className="mt-0.5 flex items-baseline gap-2">
                {product.originalPrice ? <span className="sr-only">Now </span> : null}
                <span className={`font-display leading-none font-extrabold text-ink ${wide ? "text-[28px]" : "text-[24px]"}`}>{formatPrice(startingPrice(product))}</span>
                {product.originalPrice ? (
                  <>
                    <span className="sr-only">, was </span>
                    <s className="text-[14px] text-muted">{formatPrice(startingPrice(product, product.originalPrice))}</s>
                  </>
                ) : null}
              </p>
            </div>
            <ShoppingBag size={26} strokeWidth={1.6} aria-hidden="true" className="mb-0.5 text-brand/25" />
          </div>
          <AddToCartButton product={product} size="md" className="mt-4 w-full" />
        </div>
      </div>
    </article>
  );
}

/** Grid that suits the number of deals: wide cards for one or two, a row of tall cards for three or more. */
export function DealGrid({ products, limit }: { products: Product[]; limit?: number }) {
  const shown = limit ? products.slice(0, limit) : products;
  const wide = shown.length <= 2;
  const cols = shown.length === 1 ? "mx-auto max-w-3xl" : wide ? "mx-auto max-w-3xl desk:max-w-none desk:grid-cols-2" : shown.length === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <ul className={`grid gap-5 md:gap-6 ${cols}`}>
      {shown.map((product) => (
        <li key={product.id} className="flex">
          <DealCard product={product} layout={wide ? "wide" : "tall"} />
        </li>
      ))}
    </ul>
  );
}
