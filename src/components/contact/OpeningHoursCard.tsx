import { CalendarDays, Clock3 } from "lucide-react";
import { formatTime, OPENING_HOURS, OPENING_HOURS_VERIFIED } from "../../config/contact";

export function OpeningHoursCard() {
  return (
    <section aria-labelledby="hours-title" className="relative isolate overflow-hidden rounded-2xl bg-deep p-6 text-white md:p-7">
      <Clock3 aria-hidden="true" size={220} strokeWidth={0.6} className="absolute -right-12 -bottom-14 -z-10 text-white/[0.06]" />
      <h2 id="hours-title" className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.4px] md:text-[24px]">
        Opening <span className="text-brand">Hours</span>
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-white/75">
        We are open to serve you with fresh and delicious meals every day.
      </p>

      <dl className="mt-6 flex flex-col divide-y divide-white/10">
        {OPENING_HOURS.map((row) => (
          <div key={row.days} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3.5">
            <dt className="flex items-center gap-2.5 text-[14px] font-medium">
              <CalendarDays size={17} strokeWidth={1.9} aria-hidden="true" className="shrink-0 text-brand" />
              {row.days}
            </dt>
            <dd className="text-[14px] whitespace-nowrap text-white/85">
              {row.closed || !row.open || !row.close ? "Closed" : `${formatTime(row.open)} – ${formatTime(row.close)}`}
            </dd>
          </div>
        ))}
      </dl>

      {!OPENING_HOURS_VERIFIED && <p className="mt-4 text-[12px] text-white/60">Opening hours to be confirmed.</p>}
    </section>
  );
}
