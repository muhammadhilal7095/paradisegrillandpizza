import { Link } from "react-router-dom";
import { ArrowRight, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { CONTACT, formatTime, OPENING_HOURS, OPENING_HOURS_VERIFIED, telHref } from "../../config/contact";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";
import { SectionHeading } from "../ui/SectionHeading";

const address = CONTACT.address.lines.join(", ");
const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Paradise Grill and Pizza, ${address}`)}`;

/** Where to find us, how to reach us and when we're open. */
export function VisitSection() {
  const phone = CONTACT.phones[0];
  const email = CONTACT.emails[0];
  return (
    <section aria-labelledby="visit-title" className="bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 desk:px-8">
        <div>
          <SectionHeading
            id="visit-title"
            eyebrow="Visit Us"
            title={
              <>
                Find Us on <em>Bath Road</em>
              </>
            }
            description="Collect your order from our kitchen in Slough, or let us bring it to your door."
          />
          <ul className="mt-8 flex flex-col gap-4 text-[15px]">
            <li className="flex items-start gap-3.5">
              <MapPin size={20} strokeWidth={1.9} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <address className="text-ink not-italic">{address}</address>
            </li>
            <li className="flex items-center gap-3.5">
              <Phone size={20} strokeWidth={1.9} aria-hidden="true" className="shrink-0 text-brand" />
              <a href={telHref(phone)} className="font-semibold text-ink hover:text-brand-dark">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-3.5">
              <Mail size={20} strokeWidth={1.9} aria-hidden="true" className="shrink-0 text-brand" />
              <a href={`mailto:${email}`} className="font-semibold break-all text-ink hover:text-brand-dark">
                {email}
              </a>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={ORDER_PATH} className={buttonClasses("primary", "md")}>
              Order online
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <a href={directions} target="_blank" rel="noopener noreferrer" className={buttonClasses("outlineDark", "md")}>
              <Navigation size={16} strokeWidth={2.2} aria-hidden="true" />
              Get directions
              <span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-mist p-6 md:p-8">
          <h3 className="flex items-center gap-2.5 font-display text-[20px] font-bold text-ink">
            <Clock size={20} strokeWidth={2} aria-hidden="true" className="text-brand" />
            Opening Hours
          </h3>
          <dl className="mt-5 divide-y divide-line">
            {OPENING_HOURS.map((row) => (
              <div key={row.days} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5 text-[15px]">
                <dt className="text-soft">{row.days}</dt>
                <dd className="font-semibold whitespace-nowrap text-ink">
                  {row.closed || !row.open || !row.close ? "Closed" : `${formatTime(row.open)} – ${formatTime(row.close)}`}
                </dd>
              </div>
            ))}
          </dl>
          {!OPENING_HOURS_VERIFIED && <p className="mt-3 text-[12px] text-muted">Opening hours to be confirmed.</p>}
        </div>
      </div>
    </section>
  );
}
