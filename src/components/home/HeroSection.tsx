import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Bike, Flame, MapPin, Phone, Star } from "lucide-react";
import { CONTACT, formatTime, OPENING_HOURS_VERIFIED, telHref, todaysHours } from "../../config/contact";
import { ORDER_PATH } from "../../config/site";
import { useMenu } from "../../context/menuStore";
import { formatPrice, menuImage, startingPrice, productImageName } from "../../data/menu";
import { fallbackImage } from "../menu/imageFallback";
import { AddToCartButton } from "../ui/AddToCartButton";
import { buttonClasses } from "../ui/button";

const FEATURES = [
  { icon: BadgeCheck, title: "Halal", note: "As on our logo" },
  { icon: Flame, title: "Cooked to Order", note: "Never pre-made" },
  { icon: Bike, title: "Collect or Delivery", note: "Hot to your door" },
];

/** "Open now" only when the hours are confirmed; until then a neutral location line. */
function StatusChip() {
  const today = todaysHours();
  let label = "Bath Road, Slough · Collection & Delivery";
  let live = false;
  if (OPENING_HOURS_VERIFIED && today?.open && today.close && !today.closed) {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const [oh, om] = today.open.split(":").map(Number);
    const [ch, cm] = today.close.split(":").map(Number);
    const open = oh * 60 + om;
    const close = ch * 60 + cm || 24 * 60; // "00:00" closes at midnight
    live = mins >= open && mins < close;
    label = live
      ? `Open now · until ${formatTime(today.close)}`
      : mins < open
        ? `Closed now · opens ${formatTime(today.open)} today`
        : `Closed now · opens ${formatTime(today.open)} tomorrow`;
  }
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm">
      {live ? (
        <span aria-hidden="true" className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
      ) : (
        <MapPin size={13} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
      )}
      {label}
    </p>
  );
}

/** Small floating card with a real deal from the POS (shown on large screens when one exists). */
function DealCard() {
  const { dealProducts } = useMenu();
  const deal = dealProducts[0];
  if (!deal) return null;
  const image = productImageName(deal);
  return (
    <div className="absolute right-6 bottom-8 z-10 hidden w-[300px] rounded-2xl border border-white/15 bg-black/55 p-3.5 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md desk:block wide:right-12">
      <div className="flex gap-3">
        <img
          src={menuImage(image)}
          alt=""
          onError={fallbackImage(deal)}
          width={72}
          height={72}
          className="size-[72px] shrink-0 rounded-xl bg-white object-contain"
        />
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
            <Star size={11} strokeWidth={2.6} aria-hidden="true" className="fill-brand" />
            Today's deal
          </p>
          <p title={deal.name} className="mt-1 line-clamp-2 text-[14px] leading-snug font-semibold">
            {deal.name}
          </p>
          <p className="mt-1 font-display text-[18px] font-bold">{formatPrice(startingPrice(deal))}</p>
        </div>
      </div>
      <AddToCartButton product={deal} size="sm" className="mt-3 w-full" />
    </div>
  );
}

export function HeroSection() {
  const phone = CONTACT.phones[0];
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-deep text-white">
      {/* Photo. Phones/tablets: across the top, fading into the dark behind the copy. Laptop+: full-bleed, copy on the dark left side. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[78vw] max-h-[620px] overflow-hidden md:h-[60vw] lg:inset-y-0 lg:right-0 lg:left-[40%] lg:h-auto lg:max-h-none desk:left-0">
        <img
          src="/images/hero/home-feast-1672.webp"
          srcSet="/images/hero/home-feast-960.webp 960w, /images/hero/home-feast-1672.webp 1672w"
          sizes="100vw"
          width={1672}
          height={941}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-[72%_center] motion-safe:animate-[hero-zoom_14s_ease-out_both] md:object-[80%_center] lg:object-right"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.15)_0%,rgba(5,5,5,0)_30%,rgba(5,5,5,0.55)_62%,#050505_96%)] lg:bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.5)_15%,rgba(5,5,5,0)_35%)] desk:bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.9)_30%,rgba(5,5,5,0.2)_55%,rgba(5,5,5,0)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 hidden h-24 bg-[linear-gradient(180deg,transparent,#050505)] lg:block" />
      </div>
      <div className="relative mx-auto flex max-w-[1400px] items-center px-4 pt-[58vw] pb-12 md:px-6 md:pt-[44vw] md:pb-16 lg:min-h-[600px] lg:py-20 desk:min-h-[640px] desk:px-8 wide:px-12">
        <div className="max-w-[540px]">
          <StatusChip />
          <h1 id="hero-title" className="mt-5 font-display text-[42px] leading-[1.02] font-extrabold tracking-[-1.2px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-[56px] desk:text-[64px] desk:tracking-[-1.8px]">
            <span className="block">Crave It.</span>
            <span className="block">Love It.</span>
            <span className="block text-brand">Order It.</span>
          </h1>
          <p className="mt-5 max-w-[460px] text-[16px] leading-relaxed text-white/80 desk:text-[17px]">
            Freshly made favourites, irresistible flavours, and delicious bites delivered straight to your door.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "h-12 px-7 text-[15px] shadow-[0_12px_30px_-10px_rgba(224,48,30,0.8)]")}>
              Order Now
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/menu" className={buttonClasses("outlineLight", "md", "h-12 px-7 text-[15px]")}>
              View Menu
            </Link>
          </div>
          {phone && (
            <a href={telHref(phone)} className="mt-4 inline-flex min-h-10 items-center gap-2 text-[14px] text-white/75 transition-colors hover:text-white">
              <Phone size={15} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
              Prefer to call? <span className="font-semibold text-white">{phone}</span>
            </a>
          )}

          <ul className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:flex sm:gap-0">
            {FEATURES.map(({ icon: Icon, title, note }, i) => (
              <li key={title} className={`flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2.5 sm:px-5 sm:first:pl-0 ${i > 0 ? "sm:border-l sm:border-white/15" : ""}`}>
                <Icon size={22} strokeWidth={2} className="shrink-0 text-brand" aria-hidden="true" />
                <span className="leading-tight">
                  <span className="block text-[12px] font-semibold sm:text-[13px]">{title}</span>
                  <span className="block text-[11px] text-white/55">{note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DealCard />
    </section>
  );
}
