import type { ComponentType } from "react";
import { ChefHat, Heart, Leaf, UsersRound, type LucideProps } from "lucide-react";
import { VALUES, type ValueIcon } from "../../data/about";
import { SectionHeading } from "../ui/SectionHeading";

const ICONS: Record<ValueIcon, ComponentType<LucideProps>> = {
  leaf: Leaf,
  chef: ChefHat,
  customers: UsersRound,
  heart: Heart,
};

export function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className="border-t border-line bg-white py-16 md:py-20">
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
          description="The simple things we care about in every meal we serve."
        />
        <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-9 xs:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ title, description, icon }, i) => {
            const Icon = ICONS[icon];
            return (
              <li key={title} className="flex flex-col items-center text-center">
                <span
                  className={`inline-flex size-14 items-center justify-center rounded-full ${
                    i === 0 ? "bg-brand text-white" : "bg-mist text-ink"
                  }`}
                >
                  <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[14px] font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 max-w-[15rem] text-[13px] leading-relaxed text-muted">{description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
