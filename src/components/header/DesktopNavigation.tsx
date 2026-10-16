import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../config/navigation";

export function DesktopNavigation() {
  return (
    <nav aria-label="Primary" className="hidden min-w-0 flex-1 justify-center desk:flex">
      <ul className="flex items-center gap-4 wide:gap-7">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative inline-flex h-10 items-center rounded-sm px-1 text-[13px] leading-none font-medium whitespace-nowrap transition-colors duration-200 wide:text-[14px] after:absolute after:inset-x-1 after:bottom-[7px] after:h-0.5 after:rounded-full after:bg-brand after:transition-transform after:duration-200 ${
                  isActive ? "text-brand after:scale-x-100" : "text-ink after:scale-x-0 hover:text-brand"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
