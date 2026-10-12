import { Link } from "react-router-dom";
import { BurgerIcon } from "./BurgerIcon";

interface BrandLogoProps {
  onClick?: () => void;
  /** "dark" is for dark backgrounds such as the footer. */
  tone?: "light" | "dark";
}

export function BrandLogo({ onClick, tone = "light" }: BrandLogoProps) {
  const dark = tone === "dark";
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="BurgerBite home"
      className="group flex min-h-11 shrink-0 items-center gap-2 rounded-md md:gap-2.5"
    >
      <BurgerIcon className="h-[27px] w-[30px] shrink-0 text-brand md:h-[32px] md:w-[35px] desk:h-[36px] desk:w-[40px]" />
      <span className="flex flex-col">
        <span className="font-display text-[18px] leading-none font-extrabold tracking-[-0.6px] whitespace-nowrap md:text-[21px] desk:text-[23px]">
          <span className={dark ? "text-white" : "text-ink"}>Burger</span>
          <span className="text-brand">Bite</span>
        </span>
        <span
          className={`mt-[3px] text-[8.5px] leading-[1.3] font-normal whitespace-nowrap md:text-[9.5px] desk:text-[10px] ${
            dark ? "text-white/60" : "text-muted"
          }`}
        >
          Fresh Food · Happy Mood
        </span>
      </span>
    </Link>
  );
}
