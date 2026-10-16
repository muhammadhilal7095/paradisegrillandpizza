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

import { heroImage, menuImage } from "../data/menu";

export function ReturnsPage() {
  return (
    <main>
      <PageHero
        titleId="returns-title"
        eyebrow="Refunds"
        titleTop="Your Satisfaction"
        titleBottom="Matters to Us!"
        description="We cook every order fresh. If something isn't right with your food, tell us and we'll put it right."
        image={heroImage("sides", "Cheesy garlic bread topped with herbs")}
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
              <p className="mt-3 text-[14px] text-muted">We want every Paradise order to be delicious and hassle-free.</p>
            </div>
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
          src: menuImage("meat-feast", 1080),
          width: 1080,
          height: 1080,
          alt: "Meat feast pizza on a dark tray",
        }}
      />
    </main>
  );
}
