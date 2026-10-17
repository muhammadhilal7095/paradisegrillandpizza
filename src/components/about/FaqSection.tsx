import { Plus } from "lucide-react";
import { FAQS } from "../../data/about";
import { SectionHeading } from "../ui/SectionHeading";

/** Common questions as fold-out answers (native <details>, so it works with keyboards and screen readers). */
export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-line bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-[860px] px-4 md:px-6">
        <SectionHeading
          id="faq-title"
          align="center"
          eyebrow="FAQs"
          title={
            <>
              Questions? <em>We've Got Answers</em>
            </>
          }
          description="Everything you need to know before you order."
          widthClass="max-w-2xl"
        />
        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-2xl border border-line bg-white open:shadow-[0_10px_30px_-20px_rgba(17,17,17,0.35)]">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-display text-[16px] font-bold text-ink md:px-6 md:text-[17px] [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-mist text-ink transition-transform duration-200 group-open:rotate-45 group-open:bg-brand group-open:text-white">
                  <Plus size={16} strokeWidth={2.4} />
                </span>
              </summary>
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-soft md:px-6">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
