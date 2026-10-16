import { Link } from "react-router-dom";
import { ArrowRight, Bike, Clock, MapPin, ShoppingBag } from "lucide-react";
import { CONTACT, CONTACT_DETAILS_VERIFIED, formatTime, OPENING_HOURS } from "../../config/contact";
import { ORDERING } from "../../config/ordering";
import { formatShortPrice } from "../../data/menu";
import { buttonClasses } from "../ui/button";

const card = "rounded-2xl border border-line bg-white p-5 md:p-6";
const cardTitle = "flex items-center gap-2.5 font-display text-[18px] font-bold text-ink";

/** Opening hours, collection/delivery details and location, side by side. */
export function RestaurantInfoSection() {
  const { collection, delivery } = ORDERING;
  return (
    <section aria-labelledby="info-title" className="bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-center">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Visit or Order</p>
            <h2 id="info-title" className="mt-2 font-display text-[28px] leading-[1.15] font-bold tracking-[-0.5px] text-ink md:text-[34px]">
              Hot, Fresh and <span className="text-brand">Ready When You Are</span>
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
              Everything is cooked to order in our kitchen. Pop in to collect, or let us bring it to your door.
            </p>
            <img
              src="/images/hero/about-oven-960.webp"
              alt="Pizza baking in a wood-fired oven"
              width={960}
              height={640}
              loading="lazy"
              decoding="async"
              className="mt-6 hidden aspect-[16/9] w-full rounded-2xl object-cover lg:block"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-2">
            <div className={card}>
              <h3 className={cardTitle}>
                <Clock size={20} strokeWidth={1.9} aria-hidden="true" className="text-brand" />
                Opening Hours
              </h3>
              <dl className="mt-4 space-y-2 text-[14px]">
                {OPENING_HOURS.map((row) => (
                  <div key={row.days} className="flex flex-wrap justify-between gap-x-3">
                    <dt className="text-soft">{row.days}</dt>
                    <dd className="font-semibold text-ink">
                      {row.closed || !row.open || !row.close ? "Closed" : `${formatTime(row.open)} – ${formatTime(row.close)}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={card}>
              <h3 className={cardTitle}>
                <Bike size={20} strokeWidth={1.9} aria-hidden="true" className="text-brand" />
                Delivery
              </h3>
              <ul className="mt-4 space-y-2 text-[14px] text-soft">
                <li>{delivery.note}</li>
                <li>
                  <span className="font-semibold text-ink">{formatShortPrice(delivery.fee)}</span> delivery fee
                  {delivery.freeFrom !== null && (
                    <>
                      , <span className="font-semibold text-ink">free over {formatShortPrice(delivery.freeFrom)}</span>
                    </>
                  )}
                </li>
                <li>Minimum order {formatShortPrice(delivery.minimumOrder)}</li>
              </ul>
            </div>

            <div className={card}>
              <h3 className={cardTitle}>
                <ShoppingBag size={20} strokeWidth={1.9} aria-hidden="true" className="text-brand" />
                Collection
              </h3>
              <ul className="mt-4 space-y-2 text-[14px] text-soft">
                <li>{collection.note}</li>
                <li>No minimum order</li>
                <li>Order online or on WhatsApp</li>
              </ul>
            </div>

            <div className={`${card} md:col-span-3 lg:col-span-1`}>
              <h3 className={cardTitle}>
                <MapPin size={20} strokeWidth={1.9} aria-hidden="true" className="text-brand" />
                Find Us
              </h3>
              <address className="mt-4 text-[14px] leading-relaxed text-soft not-italic">
                {CONTACT.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="mt-1 block font-semibold text-ink">{CONTACT.phones[0]}</span>
              </address>
              {!CONTACT_DETAILS_VERIFIED && <p className="mt-2 text-[11px] text-muted">Example details, to be confirmed.</p>}
              <Link to="/contact" className={buttonClasses("outlineDark", "sm", "mt-4")}>
                Contact & directions
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
