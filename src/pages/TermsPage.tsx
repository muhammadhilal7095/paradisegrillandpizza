import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { BrandRulesPanel } from "../components/terms/BrandRulesPanel";
import { TermsCard } from "../components/terms/TermsCard";
import { buttonClasses } from "../components/ui/button";
import { ClosingBanner } from "../components/ui/ClosingBanner";
import { PageHero } from "../components/ui/PageHero";
import { ORDER_PATH } from "../config/site";
import { TERMS_META, TERMS_SECTIONS } from "../data/terms";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T00:00:00`));

import { heroImage, menuImage } from "../data/menu";

export function TermsPage() {
  const draft = TERMS_META.status === "draft";

  return (
    <main>
      <PageHero
        titleId="terms-title"
        eyebrow="Terms & Conditions"
        titleTop="Good Food,"
        titleBottom="Clear Terms"
        description="The terms that apply when you order from Paradise Grill and Pizza or use this website."
        image={heroImage("legal", "Pizza with toppings on a wooden board against a dark background")}
      >
        <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-7")}>
          Order Now
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </PageHero>

      <section aria-labelledby="terms-list-title" className="bg-mist py-14 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Please read carefully</p>
              <h2 id="terms-list-title" className="mt-2 font-display text-[26px] leading-tight font-extrabold tracking-[-0.5px] text-ink md:text-[30px]">
                Our Terms &amp; <span className="text-brand">Conditions</span>
              </h2>
            </div>
            <p className="text-[13px] text-muted">
              {TERMS_META.lastUpdated ? (
                <>
                  Last updated: <time dateTime={TERMS_META.lastUpdated}>{formatDate(TERMS_META.lastUpdated)}</time>
                </>
              ) : (
                "Effective date: to be confirmed"
              )}
            </p>
          </div>

          {draft && (
            <p className="mt-5 flex items-start gap-2 rounded-lg border border-line bg-white px-4 py-3 text-[13px] text-soft">
              <Info size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-muted" />
              These terms are a draft that is still being reviewed and may change before they take effect.
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {/* The list's items sit directly in the grid; role keeps list semantics with display: contents. */}
            <ol role="list" className="contents">
              {TERMS_SECTIONS.map((section, i) => (
                <li key={section.id} className="flex [&>article]:flex-1">
                  <TermsCard section={section} index={i} />
                </li>
              ))}
            </ol>
            {/* Fills the 12th cell on two-column layouts; stacks last on phones. */}
            <div className="flex [&>aside]:flex-1">
              <BrandRulesPanel />
            </div>
          </div>
        </div>
      </section>

      <ClosingBanner
        titleId="confidence-title"
        slogan={["Good Rules", "Better Food"]}
        sloganAccentFrom={1}
        titleTop="Enjoy Your Favourite Meals"
        titleBottom="with Confidence!"
        image={{
          src: menuImage("pepperoni", 1080),
          width: 1080,
          height: 1080,
          alt: "Pepperoni pizza with melted mozzarella",
        }}
      />
    </main>
  );
}
