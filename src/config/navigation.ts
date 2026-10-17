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

/** Footer "Main" column. */
export const MAIN_LINKS: readonly NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },
];

/** Footer "Privacy" column: the legal pages. */
export const LEGAL_LINKS: readonly NavItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Return Policy", to: "/return" },
  { label: "Refund Policy", to: "/refund" },
  { label: "Terms and Conditions", to: "/terms" },
];
