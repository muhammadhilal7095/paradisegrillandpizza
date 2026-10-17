/** Brand names used across the site. */
export const BRAND = {
  name: "Paradise Grill and Pizza",
  /** Big word in the logo. */
  wordmark: "Paradise",
  /** Small line under the wordmark. */
  descriptor: "Grill & Pizza",
} as const;

/** The restaurant's social media profiles. */
export const SOCIAL_LINKS = [
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/paradisegrillandpizza" },
  { network: "facebook", label: "Facebook", href: "https://www.facebook.com/share/1J61Cjc4kH/" },
  { network: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@paradisegrillpizza12" },
] as const;

export type SocialNetwork = (typeof SOCIAL_LINKS)[number]["network"];

/** Where every "Order Now" call to action goes. */
export const ORDER_PATH = "/menu";

/** True: SOCIAL_LINKS are the restaurant's real profiles. */
export const SOCIAL_PROFILES_VERIFIED = true;
