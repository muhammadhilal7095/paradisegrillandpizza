import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryStrip } from "../components/menu/CategoryStrip";
import { MenuHero } from "../components/menu/MenuHero";
import { MenuSection } from "../components/menu/MenuSection";
import { FreshIngredientsCard } from "../components/menu/sidebar/FreshIngredientsCard";
import { QuickOrderCart } from "../components/menu/sidebar/QuickOrderCart";
import { SpecialOfferCard } from "../components/menu/sidebar/SpecialOfferCard";
import { featuredProducts, isCategoryId, MENU_CATEGORIES, productsInCategory, type CategoryId } from "../data/menu";

/** Keeps the strip's highlight on the section currently near the top of the screen. */
function useSectionSpy(enabled: boolean, initial: CategoryId) {
  const [active, setActive] = useState<CategoryId>(initial);
  const pausedUntil = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const sections = MENU_CATEGORIES.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => !!el);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        if (Date.now() < pausedUntil.current) return;
        const first = MENU_CATEGORIES.find((c) => visible.has(c.id));
        if (first) setActive(first.id);
      },
      // A band just below the sticky header + strip.
      { rootMargin: "-200px 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [enabled]);

  /** Highlight a category straight away and ignore the sections passed during the smooth scroll. */
  const select = useCallback((id: CategoryId) => {
    pausedUntil.current = Date.now() + 900;
    setActive(id);
  }, []);

  return [active, select] as const;
}

export function MenuPage() {
  const [params] = useSearchParams();
  const raw = params.get("category");
  const filter = isCategoryId(raw) ? raw : null;
  const [spyActive, select] = useSectionSpy(!filter, "burgers");
  const active = filter ?? spyActive;

  const filteredCategory = filter ? MENU_CATEGORIES.find((c) => c.id === filter) : undefined;

  return (
    <main>
      <MenuHero />
      <CategoryStrip active={active} onSelect={select} />

      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-8 md:px-6 md:py-10 desk:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] desk:gap-6 desk:px-8 wide:px-12">
        <div className="flex min-w-0 flex-col gap-12">
          {filteredCategory ? (
            <MenuSection category={filteredCategory} products={productsInCategory(filteredCategory.id)} mode="all" />
          ) : (
            MENU_CATEGORIES.map((category) => (
              <MenuSection key={category.id} category={category} products={featuredProducts(category)} mode="featured" />
            ))
          )}
        </div>

        <aside aria-label="Offers and quick order" className="grid content-start gap-4 md:grid-cols-2 lg:grid-cols-3 desk:grid-cols-1">
          <SpecialOfferCard />
          <QuickOrderCart />
          <FreshIngredientsCard />
        </aside>
      </div>
    </main>
  );
}
