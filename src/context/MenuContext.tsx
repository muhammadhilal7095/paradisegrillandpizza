import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { createCatalog, describeSelections, EMPTY_CATALOG, normaliseSelections, productImageName, unitPrice, type Catalog } from "../data/menu";
import { fetchProducts } from "../lib/products";
import { useAuth } from "./AuthContext";
import { useCart, type CartItem } from "./CartContext";
import { MenuContext, type MenuStatus } from "./menuStore";

/** Keeps a saved cart line in step with the current menu (name, price, options); null drops it. */
function refreshCartItem(catalog: Catalog) {
  return (item: CartItem): CartItem | null => {
    const p = catalog.getProduct(item.productId);
    if (!p) return null;
    const selections = normaliseSelections(p, item.selections ?? {});
    return { ...item, name: p.name, price: unitPrice(p, selections), image: productImageName(p), options: describeSelections(p, selections), selections };
  };
}

/**
 * Serves the menu from the POS API (the only source of products and categories). Retried when
 * someone logs in, since the API may require a token.
 */
export function MenuProvider({ children }: { children: ReactNode }) {
  const { status: authStatus } = useAuth();
  const { resync } = useCart();
  const [catalog, setCatalog] = useState<Catalog>(EMPTY_CATALOG);
  const [status, setStatus] = useState<MenuStatus>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (authStatus === "loading") return;
    let cancelled = false;
    setStatus((s) => (s === "ready" ? s : "loading"));
    fetchProducts().then((result) => {
      if (cancelled) return;
      if (result.ok) {
        const next = createCatalog(result.products, result.categories);
        setCatalog(next);
        setStatus("ready");
        // Saved carts follow the live menu: new prices, and items no longer sold are removed.
        resync(refreshCartItem(next));
      } else {
        setStatus((s) => (s === "ready" ? s : "unavailable"));
        if (import.meta.env.DEV) console.info(`[menu] POS API unavailable: ${result.reason}`);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [authStatus, resync, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const value = useMemo(() => ({ ...catalog, status, reload }), [catalog, status, reload]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

