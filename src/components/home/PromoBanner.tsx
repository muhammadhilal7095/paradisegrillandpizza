import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Truck, Wallet } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";

const PERKS = [
  { icon: ClipboardList, title: "Easy Ordering", note: "In Just a Few Clicks" },
  { icon: Wallet, title: "Secure Payment", note: "100% Safe" },
  { icon: Truck, title: "Fast Delivery", note: "Hot & Fresh" },
];

/** Red paint streaks swept across the banner corners. */
function Streaks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <span className="absolute -top-6 -left-16 h-24 w-72 -rotate-[28deg] rounded-full bg-[linear-gradient(90deg,transparent,#f21b2d_25%,#d91024_80%,transparent)] opacity-90 blur-[1px] md:w-[420px]" />
      <span className="absolute top-14 -left-24 h-6 w-64 -rotate-[28deg] rounded-full bg-brand/70 md:w-96" />
      <span className="absolute -right-24 bottom-10 hidden h-28 w-[620px] -rotate-[24deg] rounded-full bg-[linear-gradient(90deg,transparent,#f21b2d_30%,#d91024_85%)] opacity-90 md:block" />
      <span className="absolute top-1/3 -right-20 hidden h-10 w-[480px] -rotate-[24deg] rounded-full bg-brand/60 md:block" />
    </div>
  );
}

export function PromoBanner() {
  return (
    <section aria-labelledby="promo-title" className="relative isolate overflow-hidden bg-deep">
      <Streaks />
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-4 py-12 md:grid-cols-[1.1fr_1fr] md:px-6 lg:py-14 desk:px-8 wide:px-12">
        <div className="relative z-10 md:pl-6 desk:pl-12">
          <h2 id="promo-title" className="text-white">
            <span className="block -rotate-3 font-hand text-[40px] leading-none md:text-[48px]">Fresh Food</span>
            <span className="mt-1 block font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.6px] md:text-[36px] desk:text-[42px]">
              Delivered to Your Door
            </span>
          </h2>
          <p className="mt-3 text-[15px] text-white/80">Your favorite meals, faster and easier.</p>

          <ul className="mt-7 grid grid-cols-1 gap-4 xs:grid-cols-3 xs:gap-0">
            {PERKS.map(({ icon: Icon, title, note }, i) => (
              <li
                key={title}
                className={`flex items-center gap-2.5 xs:flex-col xs:items-start xs:px-3 xs:first:pl-0 sm:flex-row sm:items-center ${
                  i > 0 ? "xs:border-l xs:border-white/20" : ""
                }`}
              >
                <Icon size={24} strokeWidth={1.8} className="shrink-0 text-brand" aria-hidden="true" />
                <span className="leading-tight">
                  <span className="block text-[13px] font-semibold text-white">{title}</span>
                  <span className="block text-[11px] text-white/60">{note}</span>
                </span>
              </li>
            ))}
          </ul>

          <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-8")}>
            Order Now
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        {/* Photo: the source has a pure black background that melts into the section. */}
        <img
          src="/images/banner-1600.webp"
          srcSet="/images/banner-800.webp 800w, /images/banner-1600.webp 1600w"
          sizes="(min-width: 768px) 45vw, 100vw"
          width={1600}
          height={1067}
          alt="Sesame chicken burger with a basket of fries"
          loading="lazy"
          decoding="async"
          className="relative z-10 mx-auto w-full max-w-[560px] object-contain [mask-image:radial-gradient(ellipse_closest-side,#000_72%,transparent_100%)]"
        />
      </div>
    </section>
  );
}
