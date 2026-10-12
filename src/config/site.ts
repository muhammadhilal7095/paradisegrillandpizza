/** Replace these with BurgerBite's real profile URLs. */
export const SOCIAL_LINKS = [
  { network: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { network: "tiktok", label: "TikTok", href: "https://www.tiktok.com/" },
  { network: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
] as const;

export type SocialNetwork = (typeof SOCIAL_LINKS)[number]["network"];

/** Where every "Order Now" call to action goes. */
export const ORDER_PATH = "/menu";

/** Menu sidebar promotion. Display copy only — the cart does not apply this discount. */
export const TODAYS_SPECIAL = {
  eyebrow: "Today's Special",
  headline: "20% OFF",
  subline: "on All Burgers",
  to: "/menu?category=burgers",
};

/** Brand messaging for the menu sidebar — editable copy, not certifications. */
export const BRAND_PROMISE = {
  title: "Fresh Ingredients",
  highlight: "Better Taste",
  points: ["100% Fresh Produce", "Quality Meat", "Hygienic & Safe"],
};
