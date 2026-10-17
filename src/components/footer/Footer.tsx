import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, CONTACT_DETAILS_VERIFIED, formatTime, OPENING_HOURS, telHref } from "../../config/contact";
import { LEGAL_LINKS, MAIN_LINKS } from "../../config/navigation";
import { BRAND, SOCIAL_LINKS } from "../../config/site";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "../../config/ordering";
import { WhatsAppIcon } from "../cart/WhatsAppIcon";
import { BrandLogo } from "../header/BrandLogo";
import { SocialIcon } from "./SocialIcon";

const container = "mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12";
const heading = "font-display text-[15px] font-bold tracking-[0.02em] text-white";
const link = "inline-flex min-h-9 items-center text-[14px] text-white/70 transition-colors hover:text-white md:min-h-8";

function LinkColumn({ title, links }: { title: string; links: readonly { label: string; to: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className={heading}>{title}</h2>
      <ul className="mt-3">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={link}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const phone = CONTACT.phones[0];
  const email = CONTACT.emails[0];

  return (
    <footer className="bg-deep text-white print:hidden">
      <div className={`${container} grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:py-14 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]`}>
        <div className="col-span-2 lg:col-span-1">
          <BrandLogo tone="dark" size="lg" />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/70">
            Stone-baked pizza, flame-grilled peri peri chicken, kebabs and curries, cooked fresh for collection and delivery.
          </p>
          <ul className="mt-5 flex gap-2.5">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.network}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${BRAND.name} on ${social.label} (opens in a new tab)`}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-brand hover:bg-brand"
                >
                  <SocialIcon network={social.network} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <LinkColumn title="Main" links={MAIN_LINKS} />
        <LinkColumn title="Privacy" links={LEGAL_LINKS} />

        <div className="col-span-2 lg:col-span-1">
          <h2 className={heading}>Find Us</h2>
          <ul className="mt-3 space-y-3 text-[14px] text-white/70">
            <li className="flex gap-2.5">
              <MapPin size={17} strokeWidth={1.9} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <address className="not-italic">{CONTACT.address.lines.join(", ")}</address>
            </li>
            {phone && (
              <li className="flex gap-2.5">
                <Phone size={17} strokeWidth={1.9} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                {CONTACT_DETAILS_VERIFIED ? (
                  <a href={telHref(phone)} className="hover:text-white">
                    {phone}
                  </a>
                ) : (
                  <span>{phone}</span>
                )}
              </li>
            )}
            <li className="flex gap-2.5">
              <WhatsAppIcon className="mt-0.5 size-[17px] shrink-0 text-brand" />
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp {WHATSAPP_DISPLAY}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            {email && (
              <li className="flex gap-2.5">
                <Mail size={17} strokeWidth={1.9} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                {CONTACT_DETAILS_VERIFIED ? (
                  <a href={`mailto:${email}`} className="break-all hover:text-white">
                    {email}
                  </a>
                ) : (
                  <span className="break-all">{email}</span>
                )}
              </li>
            )}
            <li className="flex gap-2.5">
              <Clock size={17} strokeWidth={1.9} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <dl className="space-y-1.5">
                {OPENING_HOURS.map((row) => (
                  <div key={row.days}>
                    <dt>{row.days}</dt>
                    <dd className="whitespace-nowrap text-white">{row.closed || !row.open || !row.close ? "Closed" : `${formatTime(row.open)} – ${formatTime(row.close)}`}</dd>
                  </div>
                ))}
              </dl>
            </li>
          </ul>
          {!CONTACT_DETAILS_VERIFIED && <p className="mt-3 text-[11px] text-white/45">Example contact details, to be confirmed.</p>}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className={`${container} flex flex-col items-center gap-2 py-5 text-center text-[12px] text-white/55 md:flex-row md:justify-between md:text-left`}>
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p>Food photography from Unsplash.</p>
        </div>
      </div>
    </footer>
  );
}
