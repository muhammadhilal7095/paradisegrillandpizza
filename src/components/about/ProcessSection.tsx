import { PROCESS_STEPS } from "../../data/about";
import { SectionHeading } from "../ui/SectionHeading";

/** Three numbered steps from order to plate, on a dark band. */
export function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="bg-deep py-16 text-white md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8">
        <SectionHeading
          id="process-title"
          tone="dark"
          align="center"
          eyebrow="How It Works"
          title={
            <>
              From Our Kitchen <em>to You</em>
            </>
          }
          description="Ordering takes a couple of minutes. Cooking starts straight away."
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.title} className="relative flex flex-col items-center text-center">
              {/* Connector to the next step (desktop only). */}
              {i < PROCESS_STEPS.length - 1 && (
                <span aria-hidden="true" className="absolute top-7 left-[calc(50%+40px)] hidden h-px w-[calc(100%-80px)] border-t border-dashed border-white/25 md:block" />
              )}
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand font-display text-[22px] font-bold">
                <span className="sr-only">Step </span>
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-[19px] font-bold">{step.title}</h3>
              <p className="mt-2 max-w-[18rem] text-[15px] leading-relaxed text-white/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
