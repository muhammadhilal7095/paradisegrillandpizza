import type { ComponentType, ReactNode } from "react";
import { Globe, Pizza, Info, Mail, MapPin, Phone, type LucideProps } from "lucide-react";
import { CONTACT, CONTACT_DETAILS_VERIFIED, telHref } from "../../config/contact";
import { Fries } from "../menu/categoryIcons";

const linkClass = "transition-colors hover:text-brand-dark";

/** Shows a link once details are verified; plain text while they are examples. */
function Detail({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  if (!CONTACT_DETAILS_VERIFIED) return <span>{children}</span>;
  return (
    <a href={href} className={linkClass} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

function Item({ icon: Icon, label, children }: { icon: ComponentType<LucideProps>; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-3.5">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
        <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-[14px] font-semibold text-ink">{label}</h3>
        <div className="mt-0.5 flex flex-col text-[13px] leading-relaxed break-words text-muted">{children}</div>
      </div>
    </li>
  );
}

export function ContactInformation() {
  const host = CONTACT.website.replace(/^https?:\/\//, "");
  return (
    <section aria-labelledby="contact-info-title" className="relative overflow-hidden rounded-2xl border border-line bg-white p-6 md:p-7">
      {/* Low-contrast line art in the corner, clear of the details (hidden on small screens). */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-3 -bottom-3 hidden items-end gap-1 text-line lg:flex">
        <Fries size={64} strokeWidth={1.2} />
        <Pizza size={92} strokeWidth={1.1} />
      </div>

      <h2 id="contact-info-title" className="font-display text-[24px] leading-tight font-extrabold tracking-[-0.4px] text-ink md:text-[26px]">
        Contact <span className="text-brand">Information</span>
      </h2>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
        We're here to help! Reach out to us through any of the following channels or visit us at our location.
      </p>

      {!CONTACT_DETAILS_VERIFIED && (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-mist px-3 py-2 text-[12px] text-soft">
          <Info size={15} strokeWidth={2} aria-hidden="true" className="mt-px shrink-0 text-muted" />
          Example contact details — our final details are coming soon.
        </p>
      )}

      <ul className="relative mt-6 flex flex-col gap-5">
        <Item icon={Phone} label="Phone">
          {CONTACT.phones.map((phone) => (
            <Detail key={phone} href={telHref(phone)}>
              {phone}
            </Detail>
          ))}
        </Item>
        <Item icon={Mail} label="Email">
          {CONTACT.emails.map((email) => (
            <Detail key={email} href={`mailto:${email}`}>
              {email}
            </Detail>
          ))}
        </Item>
        <Item icon={MapPin} label="Our Location">
          <address className="not-italic">
            {CONTACT.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </Item>
        <Item icon={Globe} label="Website">
          <Detail href={CONTACT.website} external>
            {host}
          </Detail>
        </Item>
      </ul>
    </section>
  );
}
