import { Pizza } from "lucide-react";
import { STORY_PARAGRAPHS } from "../../data/about";

/** Circular restaurant photo with light decorative marks, beside the brand story. */
export function StorySection() {
  return (
    <section aria-labelledby="story-title" className="overflow-hidden bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 md:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 desk:px-8">
        <div className="relative mx-auto w-[min(78vw,280px)] md:w-[320px] desk:w-[360px]">
          {/* Decorative rings and accents sit outside the photo, never on the text. */}
          <span aria-hidden="true" className="absolute -inset-3 rounded-full border border-line" />
          <span aria-hidden="true" className="absolute -inset-6 rounded-full border border-dashed border-line" />
          <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute -top-6 -left-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] text-brand" fill="none">
            {/* Short red arc on the outer ring, upper-left. */}
            <path d="M15.7 15.7A48.5 48.5 0 0 1 50 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
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
          <h2 id="story-title" className="mt-2 font-display text-[28px] leading-[1.15] font-extrabold tracking-[-0.6px] text-ink md:text-[32px] desk:text-[36px]">
            <span className="block">A Neighbourhood Kitchen</span>
            <span className="block">
              With a <span className="text-brand">Big Heart</span>
            </span>
          </h2>
          <span aria-hidden="true" className="mx-auto mt-5 block h-1 w-12 rounded-full bg-brand lg:mx-0" />
          <div className="mx-auto mt-5 flex max-w-[34rem] flex-col gap-4 text-[14px] leading-[1.65] text-muted lg:mx-0">
            {STORY_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
