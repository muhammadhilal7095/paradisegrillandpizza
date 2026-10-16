import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  /** Line id: the product plus its chosen options (see lineId in data/menu). */
  id: string;
  productId: string;
  name: string;
  /** Unit price in pence, options included. */
  price: number;
  /** Square menu photo name (see menuImage in data/menu). */
  image: string;
  /** Chosen option labels, e.g. ['12" Large', "Extra mozzarella"]. */
  options?: string[];
  /** Raw option choices (groupId → choice ids), used to re-price saved carts. */
  selections?: Record<string, string[]>;
  quantity: number;
}

export type CartItemInput = Omit<CartItem, "quantity">;

interface CartContextValue {
  items: CartItem[];
  /** Total number of units across all lines. */
  quantity: number;
  /** Subtotal in pence. */
  subtotal: number;
  addItem: (item: CartItemInput, quantity?: number) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  /** Empties the cart (after an order is confirmed). */
  clear: () => void;
  /** Re-syncs every line with fresh menu data; lines mapped to null are dropped. */
  resync: (refresh: (item: CartItem) => CartItem | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
/** v2: carts saved before the menu came from the POS held demo products, so they are not restored. */
const STORAGE_KEY = "paradise-cart-v2";

function readStoredCart(): CartItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as CartItem[]) : null;
  } catch {
    return null;
  }
}

interface CartProviderProps {
  children: ReactNode;
  /** Used when the visitor has no saved cart yet. */
  initialItems?: CartItem[];
  /** Re-syncs a saved line with current menu data (name, price); return null to drop it. */
  refreshItem?: (item: CartItem) => CartItem | null;
}

export function CartProvider({ children, initialItems = [], refreshItem }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = readStoredCart();
    if (!stored) return initialItems;
    return refreshItem ? stored.flatMap((item) => refreshItem(item) ?? []) : stored;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, blocked) — the cart still works for this visit.
    }
  }, [items]);

  // Stable identity, so consumers can depend on it without re-running on every cart change.
  const resync = useCallback<CartContextValue["resync"]>(
    (refresh) =>
      setItems((current) => {
        const next = current.flatMap((line) => refresh(line) ?? []);
        const same = next.length === current.length && next.every((line, i) => JSON.stringify(line) === JSON.stringify(current[i]));
        return same ? current : next;
      }),
    [],
  );

  const value = useMemo<CartContextValue>(() => {
    const setItemQuantity = (id: string, quantity: number) =>
      setItems((current) =>
        quantity <= 0
          ? current.filter((line) => line.id !== id)
          : current.map((line) => (line.id === id ? { ...line, quantity: Math.floor(quantity) } : line)),
      );

    return {
      items,
      quantity: items.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: items.reduce((sum, line) => sum + line.quantity * line.price, 0),
      addItem: (item, quantity = 1) =>
        setItems((current) =>
          current.some((line) => line.id === item.id)
            ? current.map((line) => (line.id === item.id ? { ...line, quantity: line.quantity + quantity } : line))
            : [...current, { ...item, quantity }],
        ),
      setItemQuantity,
      removeItem: (id) => setItemQuantity(id, 0),
      clear: () => setItems([]),
      resync,
    };
  }, [items, resync]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
