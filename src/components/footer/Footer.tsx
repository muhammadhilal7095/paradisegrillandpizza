import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../config/navigation";
import { SOCIAL_LINKS } from "../../config/site";
import { BrandLogo } from "../header/BrandLogo";
import { SocialIcon } from "./SocialIcon";

/** The footer carries the six primary pages; T&Cs sits in the legal row instead. */
const FOOTER_PATHS = ["/", "/menu", "/offers", "/gallery", "/about", "/contact"];
const FOOTER_NAV = NAV_ITEMS.filter((item) => FOOTER_PATHS.includes(item.to));

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Returns & Refunds", to: "/return" },
];

const container = "mx-auto max-w-[1400px] px-4 md:px-6 desk:px-10 wide:px-14";

function FooterNavigation() {
  return (
    <nav aria-label="Footer navigation" className="order-2 w-full md:order-3 lg:order-2 lg:w-auto lg:flex-1">
      <ul className="mx-auto grid max-w-[18rem] grid-cols-3 justify-items-center gap-x-4 md:flex md:max-w-none md:justify-center md:gap-x-7 desk:gap-x-8">
        {FOOTER_NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `inline-flex min-h-10 items-center text-[12px] font-medium transition-colors duration-200 hover:text-brand ${
                  isActive ? "text-brand underline decoration-1 underline-offset-[5px]" : "text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterSocial() {
  return (
    <div className="order-3 flex items-center gap-3.5 md:order-2 md:ml-auto lg:order-3 lg:ml-0">
      <p className="text-[12px] font-medium whitespace-nowrap text-white">Follow Us</p>
      <ul className="flex gap-3 md:gap-2.5">
        {SOCIAL_LINKS.map((social) => (
          <li key={social.network}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow BurgerBite on ${social.label} (opens in a new tab)`}
              // 26px circle; the ::before pad keeps the tap target at ~42px.
              className="relative inline-flex size-[26px] items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-200 before:absolute before:-inset-2 hover:border-brand hover:text-brand"
            >
              <SocialIcon network={social.network} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="flex flex-col items-center gap-1 py-3 text-center text-[11px] text-silver md:min-h-10 md:flex-row md:justify-between md:py-0 md:text-left md:text-[10px]">
      <p>© {new Date().getFullYear()} BurgerBite. All rights reserved.</p>
      <nav aria-label="Legal navigation">
        <ul className="flex flex-wrap items-center justify-center gap-x-3">
          {LEGAL_LINKS.map((link, i) => (
            <li key={link.to} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-2.5 w-px bg-soft" />}
              <Link
                to={link.to}
                className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-brand md:min-h-8"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-soft bg-deep text-white">
      <div className={container}>
        {/* Mobile: stacked. Tablet: logo + social, nav below. 1024px+: one row. */}
        <div className="flex flex-col items-center gap-4 py-7 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-3 md:py-5 lg:flex-nowrap lg:py-2.5">
          <div className="order-1">
            <BrandLogo tone="dark" />
          </div>
          <FooterNavigation />
          <FooterSocial />
        </div>
        <hr className="h-px border-0 bg-soft" />
        <FooterBottom />
      </div>
    </footer>
  );
}
