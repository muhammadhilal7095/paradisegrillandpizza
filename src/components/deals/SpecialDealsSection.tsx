import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useDeals } from "../../lib/deals";
import { buttonClasses } from "../ui/button";
import { SectionHeading } from "../ui/SectionHeading";
import { SpecialDealCard } from "./SpecialDealCard";

/** Special deals created in the POS (Mobile App → Deals). Hidden when there are none. */
export function SpecialDealsSection({ tone = "dark", limit, showAllLink = false, id = "special-deals" }: { tone?: "dark" | "light"; limit?: number; showAllLink?: boolean; id?: string }) {
  const { deals } = useDeals();
  if (deals.length === 0) return null;
  const shown = limit ? deals.slice(0, limit) : deals;
  const dark = tone === "dark";
  const wide = shown.length <= 2;
  const cols = shown.length === 1 ? "mx-auto max-w-3xl" : wide ? "mx-auto max-w-3xl desk:max-w-none desk:grid-cols-2" : shown.length === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative isolate scroll-mt-20 overflow-hidden py-16 md:py-24 ${dark ? "bg-deep" : "bg-white"}`}>
      {dark && <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_30%_70%,rgba(224,48,30,0.22),transparent_70%)]" />}
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id={`${id}-title`}
            tone={dark ? "dark" : "light"}
            eyebrow="Special Deals"
            title={
              <>
                Today's <em>Special Deals</em>
              </>
            }
            description="Pick your favourites and build your deal, all for one great price."
          />
          {showAllLink && (
            <Link to="/offers" className={buttonClasses(dark ? "outlineLight" : "outlineDark", "md", "self-start md:self-auto")}>
              View all deals
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          )}
        </div>
        <ul className={`mt-10 grid gap-5 md:gap-6 ${cols}`}>
          {shown.map((deal) => (
            <li key={deal.id} className="flex">
              <SpecialDealCard deal={deal} layout={wide ? "wide" : "tall"} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
