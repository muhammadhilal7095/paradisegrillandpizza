import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, CONTACT_DETAILS_VERIFIED, telHref } from "../../config/contact";

interface ContactDetailsProps {
  showAddress?: boolean;
  /** "compact" for inside policy cards; "roomy" for the support card. */
  size?: "compact" | "roomy";
}

/**
 * Support email/phone (and optionally address). Links only once CONTACT_DETAILS_VERIFIED is true,
 * so placeholder details can never send someone to a stranger.
 */
export function ContactDetails({ showAddress = false, size = "compact" }: ContactDetailsProps) {
  const email = CONTACT.emails[0];
  const phone = CONTACT.phones[0];
  const address = CONTACT.address.lines.join(", ");
  const roomy = size === "roomy";
  const row = `flex items-start gap-2.5 text-soft ${roomy ? "text-[14px]" : "text-[13px]"}`;
  const icon = roomy ? "mt-0.5 size-8 rounded-full bg-blush p-1.5 text-brand" : "mt-0.5 size-[15px] text-brand";
  const link = "font-medium transition-colors hover:text-brand-dark";

  return (
    <ul className={`flex flex-col ${roomy ? "gap-3.5" : "mt-3 gap-1.5"}`}>
      <li className={`${row} ${roomy ? "items-center" : ""}`}>
        <Phone strokeWidth={2} aria-hidden="true" className={`shrink-0 ${icon}`} />
        <span className="sr-only">Phone: </span>
        {CONTACT_DETAILS_VERIFIED ? (
          <a href={telHref(phone)} className={link}>
            {phone}
          </a>
        ) : (
          phone
        )}
      </li>
      <li className={`${row} ${roomy ? "items-center" : ""}`}>
        <Mail strokeWidth={2} aria-hidden="true" className={`shrink-0 ${icon}`} />
        <span className="sr-only">Email: </span>
        {CONTACT_DETAILS_VERIFIED ? (
          <a href={`mailto:${email}`} className={`${link} break-all`}>
            {email}
          </a>
        ) : (
          <span className="break-all">{email}</span>
        )}
      </li>
      {showAddress && (
        <li className={row}>
          <MapPin strokeWidth={2} aria-hidden="true" className={`shrink-0 ${icon}`} />
          <span className="sr-only">Address: </span>
          <span>
            <address className="not-italic">
              {CONTACT.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            {CONTACT_DETAILS_VERIFIED && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-[13px] font-semibold text-brand-dark hover:underline"
              >
                Get directions<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </span>
        </li>
      )}
    </ul>
  );
}
