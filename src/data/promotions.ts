import { isLive, type Schedulable } from "./menu";

/**
 * Limited-time promotions shown as banners on the Offers page.
 * These are DISPLAY ONLY: the cart does not apply them. Wire them into pricing
 * once an ordering system that supports the promotion exists.
 */
export interface Promotion extends Schedulable {
  id: string;
  /** Small line above the headline. */
  eyebrow: string;
  /** "caps" = small uppercase label; "hand" = handwritten accent. */
  eyebrowStyle: "caps" | "hand";
  /** Optional plain line before the highlighted words. */
  lead?: string;
  /** Words painted on the red brush stroke. */
  highlight: string;
  /** Optional plain line after the highlight. */
  follow?: string;
  /** Handwritten supporting line. */
  tagline: string;
  image: string;
  imageAlt: string;
  ctaTo: string;
  /** Short honest qualifier shown under the button. */
  note?: string;
}

const PROMOTIONS: readonly Promotion[] = [
  {
    id: "weekend-treat",
    eyebrow: "Weekend Treat",
    eyebrowStyle: "caps",
    lead: "Buy 1",
    highlight: "Get 1 Free",
    tagline: "Double the flavour. Double the happiness.",
    image: "/images/promo-weekend-treat.webp",
    imageAlt: "Double cheeseburger with pickles on a dark background",
    ctaTo: "/menu?category=burgers",
    note: "Weekends only. Not yet available on online orders.",
  },
  {
    id: "midweek-munch",
    eyebrow: "Midweek Munch",
    eyebrowStyle: "hand",
    highlight: "Free Fries",
    follow: "with Every Meal",
    tagline: "Because good food makes better days.",
    image: "/images/promo-midweek-munch.webp",
    imageAlt: "Golden French fries in a wire basket",
    ctaTo: "/menu?category=combos",
    note: "Midweek only. Not yet available on online orders.",
  },
];

export const livePromotions = (now = new Date()) => PROMOTIONS.filter((p) => isLive(p, now));
