import { formatPrice, offerBadge, type ResolvedOffer } from "../../data/menu";
import { AddToCartButton } from "../ui/AddToCartButton";

/** Red circular badge: "20% / OFF" or "SAVE / £3". The visible text carries the meaning, not just the colour. */
export function OfferBadge({ offer, className = "" }: { offer: ResolvedOffer; className?: string }) {
  const badge = offerBadge(offer);
  const save = offer.type === "combo";
  return (
    <p
      className={`flex size-[56px] flex-col items-center justify-center rounded-full bg-brand text-white shadow-[0_4px_12px_rgba(5,5,5,0.25)] ${className}`}
    >
      <span className="sr-only">{badge.label}</span>
      <span aria-hidden="true" className={save ? "text-[10px] leading-none font-semibold tracking-wide" : "font-display text-[16px] leading-none font-extrabold"}>
        {badge.lead}
      </span>
      <span aria-hidden="true" className={save ? "mt-0.5 font-display text-[16px] leading-none font-extrabold" : "mt-0.5 text-[10px] leading-none font-semibold tracking-wide"}>
        {badge.tail}
      </span>
    </p>
  );
}

/** Current price (bold) with the original struck through; screen readers hear "Now … was …". */
export function OfferPrice({ offer }: { offer: ResolvedOffer }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="sr-only">Now </span>
      <span className="text-[19px] leading-none font-bold text-ink">{formatPrice(offer.product.price)}</span>
      <span className="sr-only">, was </span>
      <s className="text-[13px] leading-none text-muted">{formatPrice(offer.originalPrice)}</s>
    </p>
  );
}

const cartItem = ({ product }: ResolvedOffer) => ({ id: product.id, name: product.name, price: product.price, image: product.image });

interface OfferCardProps {
  offer: ResolvedOffer;
  headingLevel?: "h3" | "h2";
}

/** Compact deal card (Exclusive Deals, homepage Special Offers). */
export function OfferCard({ offer, headingLevel: Heading = "h3" }: OfferCardProps) {
  const { product } = offer;
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_6px_20px_-14px_rgba(17,17,17,0.25)]">
      <div className="relative aspect-[16/11] overflow-hidden bg-mist">
        <img
          src={product.image}
          alt={product.imageAlt}
          width={520}
          height={390}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <OfferBadge offer={offer} className="absolute top-3 left-3" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Heading className="font-display text-[16px] leading-snug font-bold text-ink">{product.name}</Heading>
        <p className="mt-1 text-[13px] text-muted">{offer.blurb ?? product.description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <OfferPrice offer={offer} />
          <AddToCartButton item={cartItem(offer)} label="Order Now" arrow />
        </div>
      </div>
    </article>
  );
}

/** Wide combo card (Combo Deals) — bigger photo, full-width button. */
export function ComboDealCard({ offer }: { offer: ResolvedOffer }) {
  const { product } = offer;
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white">
      <div className="relative aspect-[16/9] overflow-hidden bg-mist">
        <img
          src={product.image}
          alt={product.imageAlt}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <OfferBadge offer={offer} className="absolute top-3 left-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[18px] leading-snug font-bold text-ink">{product.name}</h3>
        <p className="mt-1 text-[13px] text-muted">{offer.blurb ?? product.description}</p>
        <div className="mt-auto pt-4">
          <OfferPrice offer={offer} />
          <AddToCartButton item={cartItem(offer)} label="Order Now" arrow className="mt-4 w-full" />
        </div>
      </div>
    </article>
  );
}
