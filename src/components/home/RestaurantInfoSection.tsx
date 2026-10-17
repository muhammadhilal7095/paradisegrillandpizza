import { Link } from "react-router-dom";
import { ArrowRight, Bike, Clock, MapPin, Navigation, Phone, ShoppingBag } from "lucide-react";
import { CONTACT, formatTime, OPENING_HOURS, OPENING_HOURS_VERIFIED, telHref } from "../../config/contact";
import { ORDERING } from "../../config/ordering";
import { ORDER_PATH } from "../../config/site";
import { formatShortPrice } from "../../data/menu";
import { buttonClasses } from "../ui/button";

/** Homepage "visit or order": a feature photo beside opening hours, delivery, collection and location. */
export function RestaurantInfoSection() {
  const { collection, delivery } = ORDERING;
  const phone = CONTACT.phones[0];
  const address = CONTACT.address.lines.join(", ");
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Paradise Grill and Pizza, ${address}`)}`;

  const services = [
    {
      icon: Bike,
      title: "Delivery",
      lines: [
        delivery.note,
        `${formatShortPrice(delivery.fee)} fee${delivery.freeFrom !== null ? `, free over ${formatShortPrice(delivery.freeFrom)}` : ""}`,
        `Minimum order ${formatShortPrice(delivery.minimumOrder)}`,
      ],
    },
    { icon: ShoppingBag, title: "Collection", lines: [collection.note, "No minimum order", "Order online or by phone"] },
  ];

  return (
    <section aria-labelledby="info-title" className="overflow-hidden bg-mist py-16 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 md:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 desk:px-8 wide:px-12">
        {/* Feature photo */}
        <div className="relative">
          <div className="group relative overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(17,17,17,0.55)]">
            <img
              src="/images/menu/popcorn-chicken-bucket-meal-1080.webp"
              srcSet="/images/menu/popcorn-chicken-bucket-meal-540.webp 540w, /images/menu/popcorn-chicken-bucket-meal-1080.webp 1080w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Paradise Grill & Pizzas takeaway meal: a bucket of crispy popcorn chicken with fries and an iced cola"
              width={1080}
              height={1080}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04] md:aspect-[16/11] lg:aspect-square"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0)_55%,rgba(5,5,5,0.7)_100%)]" />
            <p className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3.5 py-2 text-[13px] font-semibold text-white backdrop-blur-md md:bottom-6 md:left-6">
              <Bike size={15} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
              Hot to your door, or ready to collect
            </p>
          </div>

          {/* Floating collection badge */}
          <div className="absolute -top-4 -right-2 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgba(17,17,17,0.45)] sm:-right-4 md:-top-5 md:px-5 md:py-4">
            <p className="text-[11px] font-bold tracking-[0.1em] text-muted uppercase">Collection</p>
            <p className="mt-0.5 font-display text-[18px] leading-tight font-bold text-ink md:text-[20px]">~20 minutes</p>
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Visit or Order</p>
          <h2 id="info-title" className="mt-2 font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.6px] text-ink md:text-[40px]">
            Hot, Fresh and <span className="text-brand">Ready When You Are</span>
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-soft md:text-[16px]">
            Everything is cooked to order in our Bath Road kitchen. Pop in to collect, or let us bring it hot to your door.
          </p>

          {/* Opening hours */}
          <div className="mt-8 rounded-2xl border border-line bg-white p-5 md:p-6">
            <h3 className="flex items-center gap-2.5 font-display text-[17px] font-bold text-ink">
              <Clock size={19} strokeWidth={2} aria-hidden="true" className="text-brand" />
              Opening Hours
            </h3>
            <dl className="mt-3 divide-y divide-line">
              {OPENING_HOURS.map((row) => (
                <div key={row.days} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5 text-[14px]">
                  <dt className="text-soft">{row.days}</dt>
                  <dd className="font-semibold whitespace-nowrap text-ink">
                    {row.closed || !row.open || !row.close ? "Closed" : `${formatTime(row.open)} – ${formatTime(row.close)}`}
                  </dd>
                </div>
              ))}
            </dl>
            {!OPENING_HOURS_VERIFIED && <p className="mt-2 text-[11px] text-muted">Opening hours to be confirmed.</p>}
          </div>

          {/* Delivery & collection */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {services.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-3.5 rounded-2xl border border-line bg-white p-5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={19} strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-[16px] font-bold text-ink">{title}</h3>
                  <ul className="mt-1 space-y-0.5 text-[13px] leading-relaxed text-soft">
                    {lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Location + actions */}
          <p className="mt-6 flex items-start gap-2.5 text-[14px] text-soft">
            <MapPin size={17} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
            <span>
              <span className="font-semibold text-ink">Paradise Grill and Pizza</span>, {address}
            </span>
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to={ORDER_PATH} className={buttonClasses("primary", "md")}>
              Order online
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <a href={directions} target="_blank" rel="noopener noreferrer" className={buttonClasses("outlineDark", "md", "bg-white")}>
              <Navigation size={15} strokeWidth={2.2} aria-hidden="true" />
              Directions
              <span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
            {phone && (
              <a href={telHref(phone)} className="inline-flex min-h-11 items-center gap-2 px-1 text-[14px] font-semibold text-ink hover:text-brand-dark">
                <Phone size={16} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
                {phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
