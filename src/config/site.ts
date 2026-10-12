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
