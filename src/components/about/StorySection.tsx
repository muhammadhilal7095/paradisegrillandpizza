import { Pizza } from "lucide-react";
import { STORY_PARAGRAPHS } from "../../data/about";

/** Circular food photo with light decorative rings, beside the brand story. */
export function StorySection() {
  return (
    <section aria-labelledby="story-title" className="overflow-hidden bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 md:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 desk:px-8">
        <div className="relative mx-auto w-[min(72vw,280px)] md:w-[340px] desk:w-[380px]">
          {/* Decorative rings and accents sit outside the photo, never on the text. */}
          <span aria-hidden="true" className="absolute -inset-3 rounded-full border border-line" />
          <span aria-hidden="true" className="absolute -inset-6 rounded-full border border-dashed border-line" />
          <span aria-hidden="true" className="absolute top-[8%] -left-5 size-2.5 rounded-full bg-brand" />
          <span aria-hidden="true" className="absolute right-[2%] bottom-[12%] size-1.5 rounded-full bg-brand" />
          <span
            aria-hidden="true"
            className="absolute -bottom-4 -left-4 inline-flex size-14 items-center justify-center rounded-full border border-line bg-white text-brand shadow-[0_6px_18px_-10px_rgba(17,17,17,0.3)]"
          >
            <Pizza size={26} strokeWidth={1.6} />
          </span>
          <img
            src="/images/menu/cat-pizza-1080.webp"
            alt="Pepperoni pizza fresh from the oven"
            width={1080}
            height={1080}
            loading="lazy"
            decoding="async"
            className="relative aspect-square w-full rounded-full object-cover"
          />
        </div>

        <div className="text-center lg:text-left">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Our Story</p>
          <h2 id="story-title" className="mt-2 font-display text-[28px] leading-[1.15] font-extrabold tracking-[-0.6px] text-ink md:text-[34px] desk:text-[38px]">
            A Neighbourhood Kitchen <span className="text-brand">With a Big Heart</span>
          </h2>
          <span aria-hidden="true" className="mx-auto mt-5 block h-1 w-12 rounded-full bg-brand lg:mx-0" />
          <div className="mx-auto mt-5 flex max-w-[36rem] flex-col gap-4 text-[15px] leading-[1.75] text-soft md:text-[16px] lg:mx-0">
            {STORY_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
