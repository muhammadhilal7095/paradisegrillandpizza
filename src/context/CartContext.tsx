import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface CartContextValue {
  quantity: number;
  setQuantity: (quantity: number) => void;
  increment: () => void;
  decrement: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
  /** Starting item count until a real cart backend is connected. */
  initialQuantity?: number;
}

export function CartProvider({ children, initialQuantity = 0 }: CartProviderProps) {
  const [quantity, setRawQuantity] = useState(initialQuantity);

  const value = useMemo<CartContextValue>(() => {
    const setQuantity = (next: number) => setRawQuantity(Math.max(0, Math.floor(next)));
    return {
      quantity,
      setQuantity,
      increment: () => setRawQuantity((q) => q + 1),
      decrement: () => setRawQuantity((q) => Math.max(0, q - 1)),
    };
  }, [quantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
