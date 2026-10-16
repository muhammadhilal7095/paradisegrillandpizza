/** Brand names used across the site. */
export const BRAND = {
  name: "Paradise Grill and Pizza",
  /** Big word in the logo. */
  wordmark: "Paradise",
  /** Small line under the wordmark. */
  descriptor: "Grill & Pizza",
} as const;

/** Replace these with Paradise Grill and Pizza's real profile URLs. */
export const SOCIAL_LINKS = [
  { network: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { network: "tiktok", label: "TikTok", href: "https://www.tiktok.com/" },
  { network: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
] as const;

export type SocialNetwork = (typeof SOCIAL_LINKS)[number]["network"];

/** Where every "Order Now" call to action goes. */
export const ORDER_PATH = "/menu";

/** False until SOCIAL_LINKS point at the restaurant's real profiles (they are platform homepages for now). */
export const SOCIAL_PROFILES_VERIFIED = false;
