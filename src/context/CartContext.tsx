import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  /** Unit price in pence. */
  price: number;
  image: string;
  quantity: number;
}

export type CartItemInput = Omit<CartItem, "quantity">;

interface CartContextValue {
  items: CartItem[];
  /** Total number of units across all lines. */
  quantity: number;
  /** Subtotal in pence. */
  subtotal: number;
  addItem: (item: CartItemInput) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "burgerbite-cart";

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
}

export function CartProvider({ children, initialItems = [] }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart() ?? initialItems);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, blocked) — the cart still works for this visit.
    }
  }, [items]);

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
      addItem: (item) =>
        setItems((current) =>
          current.some((line) => line.id === item.id)
            ? current.map((line) => (line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line))
            : [...current, { ...item, quantity: 1 }],
        ),
      setItemQuantity,
      removeItem: (id) => setItemQuantity(id, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
