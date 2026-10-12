export interface NavItem {
  label: string;
  to: string;
}

/** Single source of truth for header navigation — order matters. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Offers", to: "/offers" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "T&Cs", to: "/terms" },
  { label: "Return", to: "/return" },
];
