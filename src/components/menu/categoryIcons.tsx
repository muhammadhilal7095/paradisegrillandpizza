import { CakeSlice, CookingPot, CupSoda, Drumstick, Flame, Hamburger, Pizza, Sandwich, Tag, UtensilsCrossed, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";

/** Fries in a carton, drawn on Lucide's 24px grid (Lucide has no fries icon). */
export function Fries({ size = 24, strokeWidth = 2, ...rest }: LucideProps) {
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


/** Icon for a section, chosen from words in the portal's category name. */
const ICON_BY_NAME: [RegExp, ComponentType<LucideProps>][] = [
  [/pizza/i, Pizza],
  [/burger/i, Hamburger],
  [/peri|piri|spicy|hot/i, Flame],
  [/kebab|wrap|doner|shawarma|sandwich/i, Sandwich],
  [/grill|chicken|wing|shish|tikka/i, Drumstick],
  [/curr|karahi|masala|rice|biryani/i, CookingPot],
  [/drink|beverage|soda|juice|shake|coffee|tea/i, CupSoda],
  [/dessert|sweet|cake|ice cream/i, CakeSlice],
  [/deal|offer|combo|bundle/i, Tag],
  [/side|starter|fries|chips/i, Fries],
];

export const categoryIcon = (name: string): ComponentType<LucideProps> =>
  ICON_BY_NAME.find(([re]) => re.test(name))?.[1] ?? UtensilsCrossed;
