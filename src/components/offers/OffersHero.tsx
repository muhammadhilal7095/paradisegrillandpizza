import { Link } from "react-router-dom";
import { ArrowDown, BadgeCheck, Clock, Phone, Tag, Wallet } from "lucide-react";
import { CONTACT, telHref } from "../../config/contact";
import { useMenu } from "../../context/menuStore";
import { formatPrice, heroImage, menuImage, productImageName } from "../../data/menu";
import { fallbackImage } from "../menu/imageFallback";
import { buttonClasses } from "../ui/button";

const IMAGE = heroImage("deals", "Basket of crispy fried chicken with a dipping sauce, ready to share");

/** Deals page banner: value-focused copy, live deal count and a "best value" card from the POS. */
export function OffersHero() {
  const { status, dealProducts } = useMenu();
  const phone = CONTACT.phones[0];
  const count = dealProducts.length;
  // The biggest bundle (highest price) is the natural "family" headline offer.
  const featured = [...dealProducts].sort((a, b) => b.price - a.price)[0];
  const cheapest = dealProducts.length ? Math.min(...dealProducts.map((p) => p.price)) : 0;

  const stats = [
    status === "ready" && count > 0 && { icon: Tag, text: `${count} ${count === 1 ? "deal" : "deals"} available` },
    cheapest > 0 && { icon: Wallet, text: `Meals from ${formatPrice(cheapest)}` },
    { icon: BadgeCheck, text: "Halal" },
    { icon: Clock, text: "Cooked to order" },
  ].filter(Boolean) as { icon: typeof Tag; text: string }[];

  return (
    <section aria-labelledby="offers-title" className="relative isolate overflow-hidden bg-deep text-white">
      <img
        src={IMAGE.large}
        srcSet={`${IMAGE.small} 960w, ${IMAGE.large} 1920w`}
        sizes="100vw"
        width={1920}
        height={880}
        alt={IMAGE.alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-[70%_center] [filter:saturate(1.08)_contrast(1.05)] motion-safe:animate-[hero-zoom_14s_ease-out_both]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.8),rgba(5,5,5,0.92))] desk:bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.94)_32%,rgba(5,5,5,0.5)_58%,rgba(5,5,5,0.15)_80%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_40%_70%_at_78%_55%,rgba(224,48,30,0.22),transparent_70%)] desk:block" />

      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-10 px-4 py-10 md:px-6 md:py-14 desk:min-h-[460px] desk:px-8 desk:py-16 wide:px-12">
        <div className="max-w-[580px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.04em] backdrop-blur-sm">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            Meal Deals · For One, Two or the Whole Family
          </p>

          <h1 id="offers-title" className="mt-4 font-display text-[38px] leading-[1.02] font-extrabold tracking-[-1px] md:text-[48px] desk:text-[58px] desk:tracking-[-1.6px]">
            <span className="block">Bigger Meals.</span>
            <span className="block text-brand">Better Value.</span>
          </h1>

          <p className="mt-4 max-w-[500px] text-[15px] leading-relaxed text-white/80 md:text-[16px]">
            Save on our most-loved combos: crispy fried chicken, wings, chips and a drink, bundled together at one great price. Every
            deal is cooked fresh to order, for collection or delivery.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {stats.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[12px] font-medium text-white/90">
                <Icon size={14} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="#deals" className={buttonClasses("primary", "md", "shadow-[0_12px_30px_-10px_rgba(224,48,30,0.8)]")}>
              View all deals
              <ArrowDown size={17} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <Link to="/menu" className={buttonClasses("outlineLight", "md")}>
              Full menu
            </Link>
            {phone && (
              <a href={telHref(phone)} className="inline-flex min-h-10 items-center gap-2 text-[14px] text-white/75 transition-colors hover:text-white">
                <Phone size={15} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
                <span className="font-semibold text-white">{phone}</span>
              </a>
            )}
          </div>
        </div>

        {featured && (
          <a
            href={`#${featured.id}`}
            className="hidden w-[320px] shrink-0 rounded-2xl border border-white/15 bg-black/55 p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors hover:border-white/30 desk:block"
          >
            <p className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">Best for sharing</p>
            <img
              src={menuImage(productImageName(featured))}
              alt=""
              onError={fallbackImage(featured)}
              width={300}
              height={300}
              className="mt-3 aspect-[4/3] w-full rounded-xl bg-white object-contain"
            />
            <p title={featured.name} className="mt-3 line-clamp-2 text-[15px] leading-snug font-semibold">
              {featured.name}
            </p>
            <p className="mt-1.5 font-display text-[24px] font-bold">{formatPrice(featured.price)}</p>
          </a>
        )}
      </div>
    </section>
  );
}
