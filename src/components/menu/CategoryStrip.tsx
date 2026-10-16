import { useEffect, useRef, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useMenu } from "../../context/menuStore";
import type { CategoryId } from "../../data/menu";

interface CategoryStripProps {
  active: CategoryId;
  /** Called before the jump so the highlight moves immediately. */
  onSelect: (id: CategoryId) => void;
  /** "jump" scrolls to sections on the full menu; "pages" links to each category page. */
  mode?: "jump" | "pages";
  /** Dish search (full menu only). */
  query?: string;
  onQueryChange?: (query: string) => void;
}

/**
 * Sticky bar under the header: category pills (scroll sideways, keep the active one in view)
 * and, on the full menu, a dish search.
 */
export function CategoryStrip({ active, onSelect, mode = "jump", query, onQueryChange }: CategoryStripProps) {
  const { categories } = useMenu();
  const listRef = useRef<HTMLUListElement>(null);
  const location = useLocation();

  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-category="${active}"]`);
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    // Scroll the strip only (never the page), centring the active pill.
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const handleClick = (id: CategoryId) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (mode === "pages") return;
    onSelect(id);
    // Same URL already: the router won't re-scroll, so do it here.
    if (location.pathname === "/menu" && !location.search && location.hash === `#${id}`) {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[60px] z-30 border-b border-line bg-white/95 backdrop-blur md:top-16">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2.5 px-4 py-2.5 md:flex-row md:items-center md:gap-4 md:px-6 desk:px-8 wide:px-12">
        {onQueryChange && (
          <label className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-line bg-mist px-3.5 focus-within:border-ink/30 md:order-2 md:w-[260px]">
            <Search size={16} strokeWidth={2} aria-hidden="true" className="shrink-0 text-muted" />
            <span className="sr-only">Search the menu</span>
            <input
              type="search"
              value={query ?? ""}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search dishes…"
              className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search" className="-mr-1 inline-flex size-7 items-center justify-center rounded-full text-muted hover:text-ink">
                <X size={15} strokeWidth={2.2} />
              </button>
            )}
          </label>
        )}

        <nav aria-label="Menu categories" className="min-w-0 flex-1">
          <ul ref={listRef} className="flex snap-x gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map(({ id, name }) => {
              const selected = id === active;
              return (
                <li key={id} className="shrink-0 snap-start">
                  <Link
                    to={mode === "pages" ? `/menu/${id}` : `/menu#${id}`}
                    data-category={id}
                    onClick={handleClick(id)}
                    aria-current={selected ? "true" : undefined}
                    className={`inline-flex h-10 items-center rounded-full border px-4 text-[13px] font-semibold whitespace-nowrap transition-colors duration-200 ${
                      selected ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink/40"
                    }`}
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
