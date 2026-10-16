import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import { MobileCartBar } from "../components/cart/MobileCartBar";
import { CategoryStrip } from "../components/menu/CategoryStrip";
import { MenuHero } from "../components/menu/MenuHero";
import { MenuSection } from "../components/menu/MenuSection";
import { MenuStatusNotice } from "../components/menu/MenuStatusNotice";
import { QuickOrderCart } from "../components/menu/sidebar/QuickOrderCart";
import { buttonClasses } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/menuStore";
import type { CategoryId, MenuCategory, Product } from "../data/menu";
import { NotFoundPage } from "./NotFoundPage";

/** Keeps the bar's highlight on the section currently near the top of the screen. */
function useSectionSpy(enabled: boolean, categories: readonly MenuCategory[]) {
  const [active, setActive] = useState<CategoryId>("");
  const pausedUntil = useRef(0);

  // Start on the first category once the menu loads.
  useEffect(() => {
    if (categories.length && !categories.some((c) => c.id === active)) setActive(categories[0].id);
  }, [categories, active]);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    // The active category is the last one whose section has scrolled up to just below the sticky bars.
    const update = () => {
      frame = 0;
      if (Date.now() < pausedUntil.current) return;
      const line = window.innerWidth >= 768 ? 200 : 190;
      let current = categories[0]?.id ?? "";
      for (const c of categories) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) current = c.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled, categories]);

  /** Highlight a category straight away and ignore the sections passed during the smooth scroll. */
  const select = useCallback((id: CategoryId) => {
    pausedUntil.current = Date.now() + 900;
    setActive(id);
  }, []);

  return [active, select] as const;
}

const matches = (p: Product, q: string) => `${p.name} ${p.description ?? ""}`.toLowerCase().includes(q);

/** /menu shows every category in full; /menu/:category shows one category. */
export function MenuPage() {
  const { category: slug } = useParams();
  const { status, products, categories, getCategory, productsInCategory } = useMenu();
  const { quantity } = useCart();
  const category = slug ? getCategory(slug) : undefined;
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  // With a search, only categories (and items) that match are shown.
  const sections = useMemo(
    () =>
      categories
        .map((c) => ({ category: c, items: productsInCategory(c.id).filter((p) => !q || matches(p, q)) }))
        .filter((s) => s.items.length > 0),
    [categories, productsInCategory, q],
  );
  const [spyActive, select] = useSectionSpy(!slug, categories);

  // Only a loaded menu can say a category doesn't exist.
  if (slug && status === "ready" && !category) return <NotFoundPage />;
  const active = category?.id ?? spyActive;

  return (
    <main className={quantity > 0 ? "pb-24 desk:pb-0" : ""}>
      <MenuHero category={category} dishCount={products.length} categoryCount={categories.length} />
      {categories.length > 0 && (
        <CategoryStrip
          active={active}
          onSelect={select}
          mode={category ? "pages" : "jump"}
          query={category ? undefined : query}
          onQueryChange={category ? undefined : setQuery}
        />
      )}

      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 md:px-6 md:py-10 desk:grid-cols-[minmax(0,1fr)_340px] desk:gap-8 desk:px-8 wide:px-12">
        <div className="flex min-w-0 flex-col gap-10 md:gap-12">
          {status !== "ready" ? (
            <MenuStatusNotice />
          ) : category ? (
            <MenuSection category={category} products={productsInCategory(category.id)} backLink />
          ) : sections.length > 0 ? (
            sections.map((s) => <MenuSection key={s.category.id} category={s.category} products={s.items} />)
          ) : (
            <div role="status" className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-mist px-6 py-14 text-center">
              <SearchX size={28} strokeWidth={1.8} aria-hidden="true" className="text-brand" />
              <p className="mt-3 font-display text-[18px] font-bold text-ink">No dishes match “{query.trim()}”</p>
              <p className="mt-1 text-[14px] text-muted">Try a different word, or browse the full menu.</p>
              <button type="button" onClick={() => setQuery("")} className={buttonClasses("outlineDark", "sm", "mt-5 bg-white")}>
                Clear search
              </button>
            </div>
          )}
        </div>

        <aside aria-label="Your order" className="hidden desk:block">
          <div className="sticky top-[148px]">
            <QuickOrderCart />
          </div>
        </aside>
      </div>

      <MobileCartBar />
    </main>
  );
}
