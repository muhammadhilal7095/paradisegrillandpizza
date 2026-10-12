import { NavLink } from "react-router-dom";
import { ChevronRight, Search, UserRound } from "lucide-react";
import { NAV_ITEMS } from "../../config/navigation";
import { BrandLogo } from "./BrandLogo";
import { Drawer } from "./Drawer";

export const MOBILE_NAV_ID = "mobile-navigation";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

export function MobileNavigation({ open, onClose, onOpenSearch, onOpenAccount }: MobileNavigationProps) {
  return (
    <Drawer
      id={MOBILE_NAV_ID}
      open={open}
      onClose={onClose}
      label="Site navigation"
      closeLabel="Close menu"
      heading={<BrandLogo onClick={onClose} />}
    >
      <nav aria-label="Mobile">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className="border-b border-line">
              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex min-h-[52px] items-center justify-between px-5 text-[15px] font-medium transition-colors duration-200 before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:rounded-r-full before:bg-brand before:transition-opacity ${
                    isActive ? "bg-mist text-brand before:opacity-100" : "text-ink before:opacity-0 hover:text-brand"
                  }`
                }
              >
                {item.label}
                <ChevronRight size={17} strokeWidth={1.8} aria-hidden="true" className="text-muted" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Header controls hidden on narrow screens stay reachable here. */}
      <div className="flex flex-col gap-1 p-3 md:hidden">
        <button
          type="button"
          onClick={onOpenAccount}
          className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-[15px] font-medium text-ink transition-colors hover:bg-mist hover:text-brand"
        >
          <UserRound size={19} strokeWidth={1.8} aria-hidden="true" />
          Account
        </button>
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-[15px] font-medium text-ink transition-colors hover:bg-mist hover:text-brand xs:hidden"
        >
          <Search size={19} strokeWidth={1.8} aria-hidden="true" />
          Search
        </button>
      </div>
    </Drawer>
  );
}
