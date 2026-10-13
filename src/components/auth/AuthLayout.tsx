import type { ReactNode } from "react";
import { BurgerIcon } from "../header/BurgerIcon";

interface AuthLayoutProps {
  titleId: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children: ReactNode;
  /** Wider card for the account page. */
  wide?: boolean;
}

/** Centred card on a light background — shared by every auth page. */
export function AuthLayout({ titleId, eyebrow, title, description, children, wide }: AuthLayoutProps) {
  return (
    <main className="bg-mist px-4 py-12 md:py-16">
      <section aria-labelledby={titleId} className={`mx-auto ${wide ? "max-w-[880px]" : "max-w-[460px]"}`}>
        <div className="mb-6 text-center">
          <BurgerIcon className="mx-auto h-[32px] w-[35px] text-brand" />
          <p className="mt-3 text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">{eyebrow}</p>
          <h1 id={titleId} className="mt-2 font-display text-[28px] leading-tight font-extrabold tracking-[-0.6px] text-ink md:text-[32px]">
            {title}
          </h1>
          {description && <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">{description}</p>}
        </div>
        {children}
      </section>
    </main>
  );
}

export const authCard = "rounded-2xl border border-line bg-white p-6 shadow-[0_8px_30px_-20px_rgba(17,17,17,0.25)] md:p-7";
