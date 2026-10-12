import type { ReactNode } from "react";

interface PageHeroProps {
  /** id of the h1, used to label the section. */
  titleId: string;
  eyebrow: string;
  /** First heading line (white). */
  titleTop: string;
  /** Second heading line (red). */
  titleBottom: string;
  description: string;
  image: { small: string; large: string; width: number; height: number; alt: string };
  /** "lg" for the homepage; "md" for inner pages. */
  size?: "lg" | "md";
  /** Optional handwritten note near the food. */
  annotation?: string;
  /** Call to action, or a decorative line. */
  children?: ReactNode;
}

const SIZES = {
  lg: {
    box: "md:min-h-[480px] md:py-20 lg:min-h-[520px] desk:min-h-[560px]",
    h1: "text-[38px] md:text-[44px] desk:text-[52px] desk:tracking-[-1.4px]",
    photo: "aspect-[3/2]",
  },
  md: {
    box: "md:min-h-[320px] md:py-14 desk:min-h-[360px]",
    h1: "text-[36px] md:text-[42px] desk:text-[48px]",
    photo: "aspect-[16/9]",
  },
};

/**
 * Dark photo banner: copy on the left, food on the right. On phones the photo
 * sits below the copy so text never lands on the busy part of the image.
 */
export function PageHero({ titleId, eyebrow, titleTop, titleBottom, description, image, size = "md", annotation, children }: PageHeroProps) {
  const s = SIZES[size];
  return (
    <section aria-labelledby={titleId} className="relative isolate flex flex-col overflow-hidden bg-deep md:block">
      <div className={`relative order-2 md:absolute md:inset-0 md:aspect-auto ${s.photo}`}>
        <img
          src={image.large}
          srcSet={`${image.small} 960w, ${image.large} 1920w`}
          sizes="100vw"
          width={image.width}
          height={image.height}
          alt={image.alt}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-[70%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,rgba(5,5,5,0)_38%)] md:bg-[linear-gradient(90deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.84)_33%,rgba(5,5,5,0.15)_62%,rgba(5,5,5,0)_100%)]"
        />
      </div>

      <div className={`relative order-1 mx-auto flex w-full max-w-[1400px] items-center px-4 pt-10 pb-7 md:px-6 desk:px-8 wide:px-12 ${s.box}`}>
        <div className="max-w-[460px] desk:max-w-[540px]">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">{eyebrow}</p>
          <h1 id={titleId} className={`mt-3 font-display leading-[1.05] font-extrabold tracking-[-1px] ${s.h1}`}>
            <span className="block text-white">{titleTop}</span>
            <span className="block text-brand">{titleBottom}</span>
          </h1>
          <p className="mt-4 max-w-[400px] text-[15px] leading-relaxed text-white/80 desk:text-[16px]">{description}</p>
          {children}
        </div>
      </div>

      {annotation && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute top-[17%] right-[33%] hidden -rotate-6 font-hand text-[28px] leading-none text-white md:block desk:text-[32px]"
        >
          {annotation}
          <svg viewBox="0 0 60 40" className="mt-1 ml-auto h-8 w-12 rotate-6 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4c18 2 34 10 44 28" />
            <path d="M38 30l10 3 2-11" />
          </svg>
        </p>
      )}
    </section>
  );
}
