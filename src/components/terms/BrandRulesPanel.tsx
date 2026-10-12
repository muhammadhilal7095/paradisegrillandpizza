import { CircleCheck, Hamburger, Heart } from "lucide-react";
import { BRAND_RULES } from "../../data/terms";

/** Supporting brand message that sits beside the last policy card. Not part of the terms. */
export function BrandRulesPanel() {
  return (
    <aside
      aria-label="Our promise"
      className="flex flex-col items-center gap-6 rounded-xl border border-dashed border-line bg-white p-5 text-center sm:flex-row sm:items-center sm:text-left md:p-6"
    >
      <div className="flex shrink-0 items-center gap-3">
        <Hamburger aria-hidden="true" size={56} strokeWidth={1.1} className="text-brand" />
        <p className="font-hand text-[26px] leading-[1.05] text-ink">
          Good Food
          <br />
          Comes with
          <br />
          <span className="text-brand-dark">Honest Rules</span>
          <Heart aria-hidden="true" size={18} strokeWidth={2.2} className="ml-1.5 inline-block -translate-y-0.5 text-brand" />
        </p>
      </div>
      <ul className="flex flex-col gap-2 sm:border-l sm:border-line sm:pl-6">
        {BRAND_RULES.map((rule) => (
          <li key={rule} className="flex items-center gap-2 text-[13px] font-medium text-ink">
            <CircleCheck size={16} strokeWidth={2.2} aria-hidden="true" className="shrink-0 text-brand" />
            {rule}
          </li>
        ))}
      </ul>
    </aside>
  );
}
