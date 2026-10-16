import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { buttonClasses } from "../ui/button";
import { AccountButton } from "./AccountButton";
import { AccountPanel } from "./AccountPanel";
import { BrandLogo } from "./BrandLogo";
import { CartButton } from "./CartButton";
import { CartDrawer } from "./CartDrawer";
import { onOpenCartRequest } from "./cartDrawerEvents";
import { DesktopNavigation } from "./DesktopNavigation";
import { IconButton } from "./IconButton";
import { MOBILE_NAV_ID, MobileNavigation } from "./MobileNavigation";
import { SEARCH_PANEL_ID, SearchPanel } from "./SearchPanel";

type PanelId = "search" | "account" | "cart" | "menu";

const DESKTOP_QUERY = "(min-width: 75rem)";
const ICON = { size: 20, strokeWidth: 1.8 } as const;

export function SiteHeader() {
  const [active, setActive] = useState<PanelId | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();

  const close = useCallback((restoreFocus = true) => {
    setActive(null);
    if (!restoreFocus) return;
    const target = returnFocusRef.current;
    // The original trigger may be hidden at this breakpoint; fall back to the menu toggle.
    requestAnimationFrame(() => (target?.offsetParent ? target : menuButtonRef.current)?.focus());
  }, []);

  const dismiss = useCallback(() => close(), [close]);

  const toggle = (id: PanelId) => (event: MouseEvent<HTMLButtonElement>) => {
    if (active === id) return close();
    returnFocusRef.current = event.currentTarget;
    setActive(id);
  };

  const openFromMenu = (id: PanelId) => () => {
    returnFocusRef.current = menuButtonRef.current;
    setActive(id);
  };

  // Other parts of the page (e.g. the menu's Quick Order panel) can open the cart drawer.
  useEffect(
    () =>
      onOpenCartRequest(({ trigger }) => {
        returnFocusRef.current = trigger ?? null;
        setActive("cart");
      }),
    [],
  );

  // Any navigation closes open panels.
  useEffect(() => setActive(null), [pathname]);

  // Escape closes; clicking outside the header closes the non-modal popovers.
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKeyDown);
    if (active === "search" || active === "account") document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [active, close]);

  // The mobile drawer has no purpose once the full navigation is visible.
  useEffect(() => {
    if (active !== "menu") return;
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => mql.matches && close(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [active, close]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-[60px] max-w-[1400px] items-center justify-between gap-3 px-3 xs:px-4 md:h-16 md:px-6 desk:gap-6 desk:px-8 wide:px-12">
        <BrandLogo />

        <DesktopNavigation />

        <div className="flex shrink-0 items-center gap-0.5 md:gap-1">
          <IconButton
            label="Search"
            aria-expanded={active === "search"}
            aria-controls={SEARCH_PANEL_ID}
            onClick={toggle("search")}
          >
            <Search {...ICON} />
          </IconButton>
          <div className="hidden md:block">
            <AccountButton expanded={active === "account"} onClick={toggle("account")} />
          </div>
          <CartButton expanded={active === "cart"} onClick={toggle("cart")} />
          <div className="ml-2 hidden md:block">
            <Link to={ORDER_PATH} className={buttonClasses("primary", "sm")}>
              Order Now
            </Link>
          </div>
          <div className="desk:hidden">
            <IconButton
              ref={menuButtonRef}
              label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={active === "menu"}
              aria-controls={MOBILE_NAV_ID}
              onClick={toggle("menu")}
              className="md:ml-1"
            >
              <Menu size={22} strokeWidth={1.9} />
            </IconButton>
          </div>
        </div>
      </div>

      <SearchPanel open={active === "search"} onClose={dismiss} />
      <AccountPanel open={active === "account"} onClose={dismiss} />
      <MobileNavigation open={active === "menu"} onClose={dismiss} onOpenAccount={openFromMenu("account")} />
      <CartDrawer open={active === "cart"} onClose={dismiss} />
    </header>
  );
}
