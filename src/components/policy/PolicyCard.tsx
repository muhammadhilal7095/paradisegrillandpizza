import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, type LucideProps } from "lucide-react";
import { sectionNumber, type PolicySection } from "../../data/policy";
import { ContactDetails } from "./ContactDetails";

interface PolicyCardProps {
  section: PolicySection<string>;
  index: number;
  icon: ComponentType<LucideProps>;
  /** Faint corner doodle (hidden on phones; space is reserved beside the heading). */
  doodle?: ComponentType<LucideProps>;
  /** Label for the link under the contact details. */
  contactLinkLabel?: string;
}

/** Numbered policy clause: badge, red icon, heading and the full text — never clipped. */
export function PolicyCard({ section, index, icon: Icon, doodle: Doodle, contactLinkLabel = "Contact Us" }: PolicyCardProps) {
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
            {contactLinkLabel}
            <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </>
      )}
    </article>
  );
}
