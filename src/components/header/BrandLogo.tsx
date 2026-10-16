import { Link } from "react-router-dom";
import { BRAND } from "../../config/site";

interface BrandLogoProps {
  onClick?: () => void;
  /** "dark" is for dark backgrounds such as the footer. */
  tone?: "light" | "dark";
  /** "lg" for the footer. */
  size?: "md" | "lg";
}

/** The round restaurant badge. Decorative here: the link's label and the wordmark carry the name. */
export function BrandBadge({ className }: { className: string }) {
  return (
    <img
      src="/images/brand/logo-192.webp"
      srcSet="/images/brand/logo-96.webp 96w, /images/brand/logo-192.webp 192w, /images/brand/logo-512.webp 512w"
      sizes="80px"
      alt=""
      width={192}
      height={192}
      decoding="async"
      className={`shrink-0 rounded-full ${className}`}
    />
  );
}

export function BrandLogo({ onClick, tone = "light", size = "md" }: BrandLogoProps) {
  const dark = tone === "dark";
  const lg = size === "lg";
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${BRAND.name} home`}
      className="group flex min-h-11 shrink-0 items-center gap-2.5 rounded-md md:gap-3"
    >
      <BrandBadge className={lg ? "size-16 md:size-20" : "size-11 md:size-12 desk:size-[52px]"} />
      <span className="flex flex-col">
        <span
          className={`font-display leading-none font-extrabold tracking-[-0.4px] whitespace-nowrap ${
            lg ? "text-[24px] md:text-[26px]" : "text-[19px] md:text-[22px] desk:text-[24px]"
          } ${dark ? "text-white" : "text-ink"}`}
        >
          {BRAND.wordmark}
        </span>
        <span className="mt-[3px] text-[9px] leading-none font-bold tracking-[0.22em] whitespace-nowrap text-brand uppercase md:text-[10px]">
          {BRAND.descriptor}
        </span>
      </span>
    </Link>
  );
}
