import { Pizza } from "lucide-react";
import { RETURN_STEPS } from "../../data/returns";
import { ContactDetails } from "../policy/ContactDetails";

/** Dark "How to Request a Return" steps beside the light "Contact Our Support Team" card. */
export function ReturnSupportSection() {
  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <section aria-labelledby="request-return-title" className="relative isolate overflow-hidden rounded-2xl bg-deep p-6 text-white md:p-7">
        <h2 id="request-return-title" className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.4px] md:text-[24px]">
          How to <span className="text-brand">Request a Return</span>
        </h2>
        <ol className="relative mt-6 flex flex-col gap-5">
          {/* Dashed connector between the step badges (decorative). */}
          <span aria-hidden="true" className="absolute top-4 bottom-4 left-[15px] border-l-2 border-dashed border-white/15" />
          {RETURN_STEPS.map((step, i) => (
            <li key={step} className="relative flex items-center gap-4">
              <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-[14px] font-bold">
                {i + 1}
              </span>
              <span className="text-[14px] font-medium">
                <span className="sr-only">Step {i + 1}: </span>
                {step}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[12px] text-white/60">Photos help us review some issues, but they're never required.</p>
        <Pizza aria-hidden="true" size={84} strokeWidth={1} className="absolute -right-3 -bottom-4 -z-10 text-white/10" />
      </section>

      <section
        aria-labelledby="support-team-title"
        className="flex flex-col gap-5 overflow-hidden rounded-2xl border border-brand/10 bg-blush p-6 sm:flex-row sm:items-center md:p-7"
      >
        <div className="min-w-0 flex-1">
          <h2 id="support-team-title" className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.4px] text-ink md:text-[24px]">
            Contact Our <span className="text-brand">Support Team</span>
          </h2>
          <p className="mt-2 text-[13px] text-muted">We're always ready to assist you.</p>
          <div className="mt-5">
            <ContactDetails showAddress size="roomy" />
          </div>
        </div>
        <img
          src="/images/menu/french-fries-540.webp"
          alt="Tray of golden French fries"
          width={600}
          height={450}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full rounded-xl object-cover sm:w-[38%] sm:self-stretch sm:aspect-auto"
        />
      </section>
    </div>
  );
}
