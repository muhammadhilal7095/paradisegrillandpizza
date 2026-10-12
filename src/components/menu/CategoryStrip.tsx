import { useEffect, useRef, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { MENU_CATEGORIES, type CategoryId } from "../../data/menu";
import { CATEGORY_ICONS } from "./categoryIcons";

interface CategoryStripProps {
  active: CategoryId;
  /** Called before the jump so the highlight moves immediately. */
  onSelect: (id: CategoryId) => void;
}

/**
 * Sticky row of the eight menu categories. Each item jumps to its section on the full menu.
 * Below 1024px it scrolls sideways and keeps the active item in view.
 */
export function CategoryStrip({ active, onSelect }: CategoryStripProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const location = useLocation();

  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-category="${active}"]`);
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    // Scroll the strip only (never the page), centring the active item.
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const handleClick = (id: CategoryId) => (event: MouseEvent<HTMLAnchorElement>) => {
    onSelect(id);
    // Same URL already: the router won't re-scroll, so do it here.
    if (location.pathname === "/menu" && !location.search && location.hash === `#${id}`) {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  return (
    <nav aria-label="Menu categories" className="sticky top-[60px] z-30 border-b border-line bg-white md:top-16">
      <ul
        ref={listRef}
        className="mx-auto flex max-w-[1400px] snap-x gap-2 overflow-x-auto scroll-px-4 px-4 py-2.5 [scrollbar-width:none] md:px-6 lg:justify-between lg:gap-1 lg:py-3 desk:px-8 wide:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {MENU_CATEGORIES.map(({ id, name }) => {
          const Icon = CATEGORY_ICONS[id];
          const selected = id === active;
          return (
            <li key={id} className="shrink-0 snap-start">
              <Link
                to={`/menu#${id}`}
                data-category={id}
                onClick={handleClick(id)}
                aria-current={selected ? "true" : undefined}
                className={`group flex h-11 items-center gap-2 rounded-full pr-4 pl-1.5 text-[13px] font-medium transition-colors duration-200 lg:h-auto lg:min-w-[104px] lg:flex-col lg:gap-1.5 lg:rounded-2xl lg:px-4 lg:py-2.5 ${
                  selected ? "bg-brand text-white" : "text-ink hover:bg-mist"
                }`}
              >
                <span
                  className={`inline-flex size-8 items-center justify-center rounded-full transition-colors lg:size-11 ${
                    selected ? "bg-white/15" : "bg-mist group-hover:bg-white"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" className="lg:size-[22px]" />
                </span>
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
