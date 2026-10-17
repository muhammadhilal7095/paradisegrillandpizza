import type { ComponentType } from "react";
import { BadgeCheck, ChefHat, HandCoins, Leaf, ShieldCheck, TriangleAlert, type LucideProps } from "lucide-react";
import { VALUES, type ValueIcon } from "../../data/about";
import { SectionHeading } from "../ui/SectionHeading";

const ICONS: Record<ValueIcon, ComponentType<LucideProps>> = {
  leaf: Leaf,
  chef: ChefHat,
  halal: BadgeCheck,
  allergy: TriangleAlert,
  clean: ShieldCheck,
  price: HandCoins,
};

export function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8">
        <SectionHeading
          id="values-title"
          align="center"
          eyebrow="Our Values"
          title={
            <>
              What We <em>Stand For</em>
            </>
          }
          description="The simple promises behind every meal we cook."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {VALUES.map(({ title, description, icon }) => {
            const Icon = ICONS[icon];
            return (
              <li key={title} className="flex gap-4 rounded-2xl border border-line bg-white p-5 md:p-6">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span>
                  <h3 className="font-display text-[17px] font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{description}</p>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
