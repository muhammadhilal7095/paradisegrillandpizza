import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ORDER_PATH, SOCIAL_LINKS, SOCIAL_PROFILES_VERIFIED, type SocialNetwork } from "../../config/site";
import { SocialIcon } from "../footer/SocialIcon";
import { buttonClasses } from "../ui/button";

/** Platform colours for the icons only; everything else stays on-brand. */
const BRAND_COLOURS: Record<SocialNetwork, string> = {
  facebook: "text-[#1877F2]",
  instagram: "text-[#E4405F]",
  tiktok: "text-ink",
  youtube: "text-[#FF0000]",
};

function SocialTile({ network, label, href }: { network: SocialNetwork; label: string; href: string }) {
  const inner = (
    <>
      <span className={`inline-flex size-11 items-center justify-center rounded-full bg-mist ${BRAND_COLOURS[network]}`}>
        <SocialIcon network={network} size={20} />
      </span>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {!SOCIAL_PROFILES_VERIFIED && <span className="text-[11px] text-muted">Coming soon</span>}
    </>
  );
  const base = "flex flex-col items-center gap-2 rounded-xl border border-line bg-white px-3 py-4 text-center";

  // Until real profiles exist, show the platforms without linking to a generic homepage.
  if (!SOCIAL_PROFILES_VERIFIED) return <div className={base}>{inner}</div>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow BurgerBite on ${label} (opens in a new tab)`}
      className={`${base} transition-colors hover:border-brand/40 hover:bg-blush`}
    >
      {inner}
    </a>
  );
}

export function FollowUsSection() {
  return (
    <section aria-labelledby="follow-title" className="bg-white pb-16 md:pb-20">
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 md:px-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] desk:px-8">
        <div className="relative rounded-2xl border border-line bg-white p-6 md:p-7">
          <h2 id="follow-title" className="w-fit font-display text-[22px] leading-tight font-extrabold tracking-[-0.4px] text-ink md:text-[24px]">
            Follow <span className="text-brand">Us</span>
          </h2>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted lg:max-w-[20rem]">
            Stay connected for the latest updates, special offers and delicious moments.
          </p>
          <p aria-hidden="true" className="absolute top-6 right-6 hidden rotate-[-4deg] font-hand text-[22px] leading-tight text-brand-dark lg:block">
            Join Our Food Community
            <svg viewBox="0 0 60 30" className="mt-0.5 ml-auto h-6 w-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M52 4c-8 14-24 20-44 18" />
              <path d="M16 15l-8 7 9 4" />
            </svg>
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.network}>
                <SocialTile network={s.network} label={s.label} href={s.href} />
              </li>
            ))}
          </ul>
        </div>

        <aside aria-labelledby="craving-title" className="relative isolate flex min-h-[220px] flex-col justify-center overflow-hidden rounded-2xl bg-deep p-6 text-white md:p-7">
          <img
            src="/images/offers-hero-960.webp"
            alt=""
            width={960}
            height={540}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 size-full object-cover object-[70%_center]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.8)_45%,rgba(5,5,5,0.2)_100%)]" />
          <h2 id="craving-title" className="font-display text-[26px] leading-tight font-extrabold tracking-[-0.4px]">
            Have a <span className="text-brand">Craving?</span>
          </h2>
          <p className="mt-2 font-hand text-[22px] leading-none text-white/90">Life is better with burgers!</p>
          <Link to={ORDER_PATH} className={buttonClasses("primary", "sm", "mt-5 self-start")}>
            Order Now
            <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
