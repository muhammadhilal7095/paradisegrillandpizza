import type { ComponentType } from "react";
import { Pizza, MapPin, Star, UsersRound, type LucideProps } from "lucide-react";
import { STATS, STATS_CONFIRMED, type StatIcon } from "../../data/about";
import { SectionHeading } from "../ui/SectionHeading";

const ICONS: Record<StatIcon, ComponentType<LucideProps>> = {
  customers: UsersRound,
  items: Pizza,
  locations: MapPin,
  rating: Star,
};

export function StatsSection() {
  return (
    <section aria-labelledby="stats-title" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 desk:px-8">
        <SectionHeading
          id="stats-title"
          align="center"
          eyebrow="Our Journey in Numbers"
          title={
            <>
              Growing with <em>Your Love</em>
            </>
          }
          description="A few numbers from our story so far."
        />
        {/* Screen readers hear label then number (dt, dd); CSS order shows the number above the label. */}
        <dl className="mt-10 grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-line">
          {STATS.map(({ value, label, icon }) => {
            const Icon = ICONS[icon];
            return (
              <div key={label} className="flex flex-col items-center px-2 text-center">
                <Icon size={24} strokeWidth={1.8} aria-hidden="true" className="order-1 text-brand" />
                <dt className="order-3 mt-1 text-[13px] text-muted">{label}</dt>
                <dd className="order-2 mt-2 font-display text-[28px] leading-none font-bold text-brand-dark md:text-[30px]">{value}</dd>
              </div>
            );
          })}
        </dl>
        {!STATS_CONFIRMED && (
          <p className="mt-8 text-center text-[12px] text-muted">Example figures shown for illustration — to be confirmed.</p>
        )}
      </div>
    </section>
  );
}
