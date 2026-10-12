import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardCheck,
  Copyright,
  CreditCard,
  CupSoda,
  FileText,
  Hamburger,
  Mail,
  Phone,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  UsersRound,
  type LucideProps,
} from "lucide-react";
import { CONTACT, CONTACT_DETAILS_VERIFIED, telHref } from "../../config/contact";
import { sectionNumber, type TermsIcon, type TermsSection } from "../../data/terms";
import { Fries } from "../menu/categoryIcons";

const ICONS: Record<TermsIcon, ComponentType<LucideProps>> = {
  file: FileText,
  bag: ShoppingBag,
  card: CreditCard,
  clipboard: ClipboardCheck,
  truck: Truck,
  star: Star,
  users: UsersRound,
  shield: ShieldCheck,
  copyright: Copyright,
  scale: Scale,
  mail: Mail,
};

/** A few cards get a faint food doodle in the top-right corner (space is reserved beside the heading). */
const DOODLES: Partial<Record<number, ComponentType<LucideProps>>> = { 0: Hamburger, 4: Fries, 8: CupSoda };

function ContactDetails() {
  const email = CONTACT.emails[0];
  const phone = CONTACT.phones[0];
  const row = "flex items-center gap-2 text-[13px] text-soft";
  return (
    <ul className="mt-3 flex flex-col gap-1.5">
      <li className={row}>
        <Mail size={15} strokeWidth={2} aria-hidden="true" className="shrink-0 text-brand" />
        <span className="sr-only">Email: </span>
        {CONTACT_DETAILS_VERIFIED ? (
          <a href={`mailto:${email}`} className="font-medium transition-colors hover:text-brand-dark">
            {email}
          </a>
        ) : (
          email
        )}
      </li>
      <li className={row}>
        <Phone size={15} strokeWidth={2} aria-hidden="true" className="shrink-0 text-brand" />
        <span className="sr-only">Phone: </span>
        {CONTACT_DETAILS_VERIFIED ? (
          <a href={telHref(phone)} className="font-medium transition-colors hover:text-brand-dark">
            {phone}
          </a>
        ) : (
          phone
        )}
      </li>
    </ul>
  );
}

export function TermsCard({ section, index }: { section: TermsSection; index: number }) {
  const Icon = ICONS[section.icon];
  const Doodle = DOODLES[index];
  const headingId = `${section.id}-title`;

  return (
    <article
      id={section.id}
      aria-labelledby={headingId}
      className="relative scroll-mt-24 rounded-xl border border-line bg-white p-5 shadow-[0_4px_16px_-12px_rgba(17,17,17,0.18)] md:p-6"
    >
      {Doodle && <Doodle aria-hidden="true" size={40} strokeWidth={1.1} className="absolute top-4 right-4 hidden text-line sm:block" />}

      <div className={`flex items-center gap-3 ${Doodle ? "sm:pr-12" : ""}`}>
        <span aria-hidden="true" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-blush text-[12px] font-semibold text-brand-dark tabular-nums">
          {sectionNumber(index)}
        </span>
        <Icon size={24} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-brand" />
        <h3 id={headingId} className="text-[15px] leading-snug font-semibold text-ink">
          <span className="sr-only">Section {index + 1}: </span>
          {section.title}
        </h3>
      </div>

      <div className="mt-3 flex flex-col gap-2.5 text-[13px] leading-[1.6] text-soft">
        {section.content.map((paragraph, i) =>
          typeof paragraph === "string" ? (
            <p key={i}>{paragraph}</p>
          ) : (
            <p key={i}>
              {paragraph.text}{" "}
              <Link to={paragraph.link.to} className="font-semibold text-brand-dark underline-offset-2 hover:underline">
                {paragraph.link.label}
              </Link>
              .
            </p>
          ),
        )}
      </div>

      {section.showContactDetails && (
        <>
          <ContactDetails />
          <Link
            to="/contact"
            className="mt-4 inline-flex min-h-10 items-center gap-1 text-[13px] font-semibold text-brand-dark transition-colors hover:text-ink"
          >
            Contact Us
            <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </>
      )}
    </article>
  );
}
