import { CircleCheck } from "lucide-react";
import { BRAND_PROMISE } from "../../../config/site";

export function FreshIngredientsCard() {
  return (
    <section
      aria-labelledby="fresh-ingredients-title"
      className="relative isolate overflow-hidden rounded-2xl bg-deep p-5 text-white"
    >
      <img
        src="/images/fresh-ingredients.webp"
        alt=""
        width={640}
        height={480}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-right"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.82)_55%,rgba(5,5,5,0.35)_100%)]"
      />
      <h2 id="fresh-ingredients-title" className="font-display text-[20px] leading-tight font-bold">
        <span className="block">{BRAND_PROMISE.title}</span>
        <span className="block text-brand">{BRAND_PROMISE.highlight}</span>
      </h2>
      <ul className="mt-4 flex flex-col gap-2">
        {BRAND_PROMISE.points.map((point) => (
          <li key={point} className="flex items-center gap-2 text-[13px] font-medium">
            <CircleCheck size={17} strokeWidth={2.2} aria-hidden="true" className="shrink-0 text-brand" />
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
