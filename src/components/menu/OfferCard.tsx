import { formatPrice, type ResolvedOffer } from "../../data/menu";
import { AddToCartButton } from "../ui/AddToCartButton";

interface OfferCardProps {
  offer: ResolvedOffer;
  headingLevel?: "h3" | "h2";
}

export function OfferCard({ offer, headingLevel: Heading = "h3" }: OfferCardProps) {
  const { product } = offer;
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
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
        <p className="absolute top-3 left-3 flex size-[54px] flex-col items-center justify-center rounded-full bg-brand text-white shadow-[0_4px_12px_rgba(5,5,5,0.25)]">
          <span className="font-display text-[16px] leading-none font-extrabold">{offer.discountPercent}%</span>
          <span className="mt-0.5 text-[10px] leading-none font-semibold tracking-wide">OFF</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Heading className="font-display text-[16px] leading-snug font-bold text-ink">{product.name}</Heading>
        <p className="mt-1 text-[13px] text-muted">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="flex items-baseline gap-2">
            <span className="sr-only">Now </span>
            <span className="text-[19px] leading-none font-bold text-ink">{formatPrice(product.price)}</span>
            <span className="sr-only">, was </span>
            <s className="text-[13px] leading-none text-muted">{formatPrice(offer.originalPrice)}</s>
          </p>
          <AddToCartButton
            item={{ id: product.id, name: product.name, price: product.price, image: product.image }}
            label="Order Now"
          />
        </div>
      </div>
    </article>
  );
}
