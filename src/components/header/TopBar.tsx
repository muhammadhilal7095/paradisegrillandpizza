import { Bike, Clock, Phone } from "lucide-react";
import { CONTACT, CONTACT_DETAILS_VERIFIED, formatTime, telHref, todaysHours } from "../../config/contact";
import { ORDERING } from "../../config/ordering";
import { formatShortPrice } from "../../data/menu";

/** Thin info strip above the header: today's hours, phone and the delivery offer. */
export function TopBar() {
  const today = todaysHours();
  const phone = CONTACT.phones[0];
  const { delivery } = ORDERING;

  return (
    <div className="bg-deep text-[12px] text-white/85">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between gap-4 px-3 xs:px-4 md:px-6 desk:px-8 wide:px-12">
        <p className="flex items-center gap-1.5 truncate">
          <Clock size={14} strokeWidth={2} aria-hidden="true" className="shrink-0 text-brand" />
          {today && !today.closed && today.open && today.close ? (
            <span className="truncate">
              Open today <span className="font-semibold text-white">{formatTime(today.open)} – {formatTime(today.close)}</span>
            </span>
          ) : (
            <span>Closed today</span>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-5">
          {delivery.enabled && delivery.freeFrom !== null && (
            <p className="hidden items-center gap-1.5 lg:flex">
              <Bike size={15} strokeWidth={2} aria-hidden="true" className="text-brand" />
              Free delivery over {formatShortPrice(delivery.freeFrom)}
            </p>
          )}
          {phone && (
            <p className="flex items-center gap-1.5">
              <Phone size={14} strokeWidth={2} aria-hidden="true" className="text-brand" />
              <span className="sr-only">Phone: </span>
              {CONTACT_DETAILS_VERIFIED ? (
                <a href={telHref(phone)} className="font-semibold text-white hover:text-brand">
                  {phone}
                </a>
              ) : (
                <span className="font-semibold text-white">{phone}</span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
