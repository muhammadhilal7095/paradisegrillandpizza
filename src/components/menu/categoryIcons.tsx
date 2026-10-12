import { CakeSlice, CupSoda, Drumstick, Hamburger, Pizza, Sandwich, UtensilsCrossed, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import type { CategoryId } from "../../data/menu";

/** Fries in a carton, drawn on Lucide's 24px grid (Lucide has no fries icon). */
function Fries({ size = 24, strokeWidth = 2, ...rest }: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d="M5 10h14l-1.6 10.2a1 1 0 0 1-1 .8H7.6a1 1 0 0 1-1-.8Z" />
      <path d="M8 10 7 4M11 10V3M14 10l.6-6M17 10l1.2-4.5" />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<CategoryId, ComponentType<LucideProps>> = {
  burgers: Hamburger,
  chicken: Drumstick,
  wraps: Sandwich,
  pizza: Pizza,
  sides: Fries,
  drinks: CupSoda,
  desserts: CakeSlice,
  combos: UtensilsCrossed,
};
