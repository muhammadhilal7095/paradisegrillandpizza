import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  /** Title; wrap the highlighted words in <em>. */
  title: ReactNode;
  description: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}

export function SectionHeading({ id, eyebrow, title, description, align = "left", tone = "light" }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={align === "center" ? "mx-auto max-w-xl text-center" : "max-w-xl"}>
      <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">{eyebrow}</p>
      <h2
        id={id}
        className={`mt-2 font-display text-[28px] leading-[1.15] font-extrabold tracking-[-0.6px] md:text-[34px] desk:text-[38px] [&_em]:text-brand [&_em]:not-italic ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      <p className={`mt-3 text-[14px] leading-relaxed md:text-[15px] ${dark ? "text-white/75" : "text-muted"}`}>
        {description}
      </p>
    </div>
  );
}
