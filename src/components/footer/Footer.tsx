import { Link } from "react-router-dom";
import { NAV_ITEMS } from "../../config/navigation";
import { SOCIAL_LINKS } from "../../config/site";
import { BrandLogo } from "../header/BrandLogo";
import { SocialIcon } from "./SocialIcon";

// T&Cs lives in the legal row below, so it isn't repeated in the main links.
const FOOTER_NAV = NAV_ITEMS.filter((item) => item.to !== "/terms");

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="flex flex-col items-center gap-7 py-10 text-center lg:flex-row lg:justify-between lg:gap-10 lg:text-left">
          <BrandLogo tone="dark" />

          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1">
              {FOOTER_NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex min-h-10 items-center text-[14px] font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <p className="text-[14px] font-semibold">Follow Us</p>
            <ul className="flex gap-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`BurgerBite on ${social.label} (opens in a new tab)`}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand hover:bg-brand"
                  >
                    <SocialIcon network={social.network} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-white/10 py-5 text-[13px] text-white/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} BurgerBite. All rights reserved.</p>
          <ul className="flex items-center gap-3">
            {LEGAL_LINKS.map((link, i) => (
              <li key={link.to} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-white/25" />}
                <Link to={link.to} className="inline-flex min-h-10 items-center transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
