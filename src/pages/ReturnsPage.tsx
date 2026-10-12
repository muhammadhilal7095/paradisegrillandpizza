import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Ban, CircleX, ClipboardCheck, Heart, Info, MessageCircle, RefreshCw, Truck, Utensils, Wallet, type LucideProps } from "lucide-react";
import { Fries } from "../components/menu/categoryIcons";
import { PolicyCard } from "../components/policy/PolicyCard";
import { ReturnSupportSection } from "../components/returns/ReturnSupportSection";
import { buttonClasses } from "../components/ui/button";
import { ClosingBanner } from "../components/ui/ClosingBanner";
import { PageHero } from "../components/ui/PageHero";
import { ORDER_PATH } from "../config/site";
import { RETURNS_META, RETURNS_SECTIONS, type ReturnsIcon } from "../data/returns";

const ICONS: Record<ReturnsIcon, ComponentType<LucideProps>> = {
  utensils: Utensils,
  clipboard: ClipboardCheck,
  ban: Ban,
  wallet: Wallet,
  refresh: RefreshCw,
  truck: Truck,
  x: CircleX,
  message: MessageCircle,
};

const DOODLES: Partial<Record<number, ComponentType<LucideProps>>> = { 1: Fries, 5: Truck };

export function ReturnsPage() {
  return (
    <main>
      <PageHero
        titleId="returns-title"
        eyebrow="Returns & Refunds"
        titleTop="Your Satisfaction"
        titleBottom="Matters to Us!"
        description="At BurgerBite, we always aim to serve fresh, tasty and high-quality food. If something isn't right, we're here to make it right."
        image={{
          small: "/images/returns-hero-960.webp",
          large: "/images/returns-hero-1920.webp",
          width: 1920,
          height: 700,
          alt: "Crispy chicken burger with tomato and lettuce on a wooden board, warm lights behind",
        }}
        annotation="Freshly Made Always"
      >
        <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-7")}>
          Order Now
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </PageHero>

      <section aria-labelledby="return-policy-title" className="bg-white py-14 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8">
          <div className="relative">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Our Return Policy</p>
              <h2 id="return-policy-title" className="mt-2 font-display text-[28px] leading-[1.15] font-extrabold tracking-[-0.6px] text-ink md:text-[32px]">
                Simple, Fair &amp; <span className="text-brand">Customer-Friendly</span>
              </h2>
              <p className="mt-3 text-[14px] text-muted">We want every BurgerBite experience to be delicious and hassle-free.</p>
            </div>
            {/* Decorative note in the empty space to the right of the centred heading (desktop only). */}
            <p aria-hidden="true" className="absolute top-2 right-0 hidden rotate-[-5deg] font-hand text-[24px] leading-[1.05] text-ink desk:block">
              Good Food
              <br />
              <span className="text-brand-dark">Happy Customers</span>
              <Heart size={16} strokeWidth={2.2} className="ml-1 inline-block -translate-y-0.5 text-brand" />
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            {RETURNS_META.status === "draft" && (
              <p className="inline-flex items-start gap-2 rounded-lg border border-line bg-mist px-4 py-2.5 text-left text-[13px] text-soft">
                <Info size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-muted" />
                This policy is a draft that is still being reviewed and may change. It does not affect your legal rights.
              </p>
            )}
          </div>

          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {RETURNS_SECTIONS.map((section, i) => (
              <li key={section.id} className="flex [&>article]:flex-1">
                <PolicyCard section={section} index={i} icon={ICONS[section.icon]} doodle={DOODLES[i]} contactLinkLabel="Contact Support" />
              </li>
            ))}
          </ol>

          <ReturnSupportSection />
        </div>
      </section>

      <ClosingBanner
        titleId="happier-days-title"
        slogan={["Great Food", "Great Service", "Always for You!"]}
        sloganAccentFrom={2}
        titleTop="Fresh Meals"
        titleBottom="Happier Days"
        titleAccent={<Heart size={26} strokeWidth={2} aria-hidden="true" className="ml-2 inline-block -translate-y-1 align-middle" />}
        image={{
          src: "/images/promo-weekend-treat.webp",
          width: 900,
          height: 600,
          alt: "Double cheeseburger with pickles on a dark background",
        }}
      />
    </main>
  );
}
