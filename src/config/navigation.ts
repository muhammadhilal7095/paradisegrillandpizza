export interface NavItem {
  label: string;
  to: string;
}

/** Single source of truth for header navigation. Order matters. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Deals", to: "/offers" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** Footer "Information" column. */
export const INFO_LINKS: readonly NavItem[] = [
  { label: "About Us", to: "/about" },
  { label: "Special Offers", to: "/offers" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
  { label: "Your Cart", to: "/cart" },
];

export const LEGAL_LINKS: readonly NavItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Refunds", to: "/return" },
];
