import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight, Clock, FileText, Mail, MapPin, Phone, Printer } from "lucide-react";
import { CONTACT, telHref } from "../../config/contact";
import { LEGAL_LINKS } from "../../config/navigation";
import { BRAND } from "../../config/site";
import type { PolicyDocument, PolicyParagraph, PolicySection } from "../../data/policy";

interface PolicyDocumentPageProps {
  /** Document title, e.g. "Refund Policy". */
  name: string;
  /** One-sentence introduction under the title. */
  description: string;
  doc: PolicyDocument;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T00:00:00`));

/** Plain text of a section, for the reading-time estimate. */
const sectionText = (s: PolicySection) =>
  [s.title, ...s.content.map((p) => (typeof p === "string" ? p : `${p.text} ${p.link.label}`)), ...(s.bullets ?? [])].join(" ");

/** Highlights the section currently being read in the contents list. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

function Paragraph({ p }: { p: PolicyParagraph }) {
  if (typeof p === "string") return <p>{p}</p>;
  return (
    <p>
      {p.text}{" "}
      <Link to={p.link.to} className="font-semibold text-brand-dark underline decoration-brand/30 underline-offset-[3px] hover:decoration-brand-dark">
        {p.link.label}
      </Link>
      .
    </p>
  );
}

/**
 * Shared layout for the legal pages, styled as a formal document: title band, tabs between the
 * legal pages, a contents list that tracks your position, a summary box and numbered sections.
 * Prints cleanly (site header, footer and navigation are hidden when printing).
 */
export function PolicyDocumentPage({ name, description, doc }: PolicyDocumentPageProps) {
  const { meta, summary, sections } = doc;
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  const minutes = Math.max(1, Math.round(sections.map(sectionText).join(" ").split(/\s+/).length / 220));
  const tabsRef = useRef<HTMLUListElement>(null);
  // On narrow screens, scroll the tab row (not the page) so the current page's tab is visible.
  useEffect(() => {
    const list = tabsRef.current;
    const current = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (list && current) list.scrollLeft = current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2;
  }, [name]);
  const phone = CONTACT.phones[0];
  const email = CONTACT.emails[0];

  const contents = (
    <ol className="flex flex-col">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
            className={`flex gap-2.5 border-l-2 py-1.5 pl-3 text-[13px] leading-snug transition-colors ${
              active === s.id ? "border-brand font-semibold text-ink" : "border-line text-muted hover:border-ink/30 hover:text-ink"
            }`}
          >
            <span className="w-4 shrink-0 tabular-nums">{i + 1}.</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="bg-white">
      {/* Title band */}
      <header className="border-b border-line bg-mist print:border-0 print:bg-white">
        <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-0 md:px-6 md:pt-12 desk:px-8">
          <nav aria-label="Breadcrumb" className="print:hidden">
            <ol className="flex flex-wrap items-center gap-1 text-[13px] text-muted">
              <li className="flex items-center gap-1">
                <Link to="/" className="hover:text-ink">
                  Home
                </Link>
                <ChevronRight size={14} aria-hidden="true" />
              </li>
              <li className="flex items-center gap-1">
                Legal
                <ChevronRight size={14} aria-hidden="true" />
              </li>
              <li aria-current="page" className="text-ink">
                {name}
              </li>
            </ol>
          </nav>

          <h1 className="mt-4 font-display text-[34px] leading-[1.1] font-bold tracking-[-0.8px] text-ink md:text-[46px]">{name}</h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-soft md:text-[17px]">{description}</p>

          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted">
            <div className="flex items-center gap-1.5">
              <FileText size={15} strokeWidth={2} aria-hidden="true" />
              <dt className="sr-only">Last updated</dt>
              <dd>{meta.lastUpdated ? `Last updated ${formatDate(meta.lastUpdated)}` : "Effective date to be confirmed"}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={15} strokeWidth={2} aria-hidden="true" />
              <dt className="sr-only">Reading time</dt>
              <dd>{minutes} min read</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Issued by</dt>
              <dd>{BRAND.name}</dd>
            </div>
          </dl>

          {/* Tabs between the legal pages */}
          <nav aria-label="Legal pages" className="mt-8 print:hidden">
            <ul ref={tabsRef} className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to} className="shrink-0">
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `inline-flex h-11 items-center border-b-2 px-3.5 text-[14px] font-semibold whitespace-nowrap transition-colors ${
                        isActive ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14 desk:px-8">
        {/* Contents: sticky on desktop */}
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-24">
            <p className="mb-3 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Contents</p>
            {contents}
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-semibold text-ink transition-colors hover:border-ink/30"
            >
              <Printer size={15} strokeWidth={2} aria-hidden="true" />
              Print this page
            </button>
          </div>
        </aside>

        <article className="min-w-0 max-w-[760px]">
          {/* Contents: fold-out on phones and tablets */}
          <details className="group mb-8 rounded-xl border border-line lg:hidden print:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-[14px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              Contents
              <ChevronDown size={18} aria-hidden="true" className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-line px-2 py-3">{contents}</div>
          </details>

          {summary.length > 0 && (
            <section aria-labelledby="summary-title" className="rounded-xl border-l-4 border-brand bg-blush/60 px-5 py-5 md:px-6 print:bg-white">
              <h2 id="summary-title" className="text-[12px] font-bold tracking-[0.12em] text-brand-dark uppercase">
                Summary
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-[15px] leading-relaxed text-ink">
                {summary.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-brand" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] text-soft">This summary is for convenience only. The full text below applies.</p>
            </section>
          )}

          <div className="mt-10 flex flex-col">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24 border-t border-line py-8 first:border-t-0 first:pt-0">
                <h2 id={`${s.id}-title`} className="flex gap-3 font-display text-[21px] leading-snug font-bold tracking-[-0.3px] text-ink md:text-[23px]">
                  <span className="text-brand tabular-nums">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-[15px] leading-[1.75] text-soft md:text-[16px]">
                  {s.content.map((p, j) => (
                    <Paragraph key={j} p={p} />
                  ))}
                  {s.bullets && s.bullets.length > 0 && (
                    <ul className="flex flex-col gap-2.5">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ink/40" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Contact */}
          <section aria-labelledby="legal-contact-title" className="mt-4 rounded-2xl border border-line bg-mist p-6 md:p-8 print:bg-white">
            <h2 id="legal-contact-title" className="font-display text-[21px] font-bold text-ink">
              Contact us
            </h2>
            <p className="mt-1.5 text-[15px] text-soft">Questions about this {name.toLowerCase()}? Get in touch with {BRAND.name}.</p>
            <ul className="mt-5 grid gap-3 text-[15px] sm:grid-cols-2">
              <li className="flex items-center gap-3">
                <Phone size={18} strokeWidth={2} aria-hidden="true" className="shrink-0 text-brand" />
                <a href={telHref(phone)} className="font-semibold text-ink hover:text-brand-dark">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} strokeWidth={2} aria-hidden="true" className="shrink-0 text-brand" />
                <a href={`mailto:${email}`} className="font-semibold break-all text-ink hover:text-brand-dark">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3 sm:col-span-2">
                <MapPin size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                <address className="text-soft not-italic">{CONTACT.address.lines.join(", ")}</address>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}
