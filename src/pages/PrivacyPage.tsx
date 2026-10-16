import type { ComponentType } from "react";
import { Clock, Globe, Info, LockKeyhole, Mail, MessageSquare, Scale, ShoppingCart, UserRound, type LucideProps } from "lucide-react";
import { PolicyCard } from "../components/policy/PolicyCard";
import { PageHero } from "../components/ui/PageHero";
import { heroImage } from "../data/menu";
import { PRIVACY_META, PRIVACY_SECTIONS, type PrivacyIcon } from "../data/privacy";

const ICONS: Record<PrivacyIcon, ComponentType<LucideProps>> = {
  user: UserRound,
  cart: ShoppingCart,
  message: MessageSquare,
  lock: LockKeyhole,
  globe: Globe,
  clock: Clock,
  scale: Scale,
  mail: Mail,
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T00:00:00`));

export function PrivacyPage() {
  return (
    <main>
      <PageHero
        titleId="privacy-title"
        eyebrow="Privacy Policy"
        titleTop="Your Privacy"
        titleBottom="Matters to Us"
        description="What we collect when you order, why we need it, and how you stay in control of your information."
        image={heroImage("legal", "Pizza with toppings on a wooden board against a dark background")}
      />

      <section aria-labelledby="privacy-list-title" className="bg-mist py-14 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 id="privacy-list-title" className="font-display text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink md:text-[30px]">
              How We Handle <span className="text-brand">Your Data</span>
            </h2>
            <p className="text-[13px] text-muted">
              {PRIVACY_META.lastUpdated ? (
                <>
                  Last updated: <time dateTime={PRIVACY_META.lastUpdated}>{formatDate(PRIVACY_META.lastUpdated)}</time>
                </>
              ) : (
                "Effective date: to be confirmed"
              )}
            </p>
          </div>

          {PRIVACY_META.status === "draft" && (
            <p className="mt-5 flex items-start gap-2 rounded-lg border border-line bg-white px-4 py-3 text-[13px] text-soft">
              <Info size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-muted" />
              This policy is a draft that is still being reviewed and may change before it takes effect.
            </p>
          )}

          <ol role="list" className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {PRIVACY_SECTIONS.map((section, i) => (
              <li key={section.id} className={`flex [&>article]:flex-1 ${i === PRIVACY_SECTIONS.length - 1 ? "md:col-span-2" : ""}`}>
                <PolicyCard section={section} index={i} icon={ICONS[section.icon]} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
