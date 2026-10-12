import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider, type CartItem } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { getProduct } from "./data/menu";
import "./index.css";

/** First-visit example cart (shown in the menu's Quick Order panel). */
const EXAMPLE_CART: CartItem[] = ["classic-burger", "french-fries"].flatMap((id) => {
  const p = getProduct(id);
  return p ? [{ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 }] : [];
});

/** Keeps saved carts in step with menu changes; drops items no longer on the menu. */
function refreshItem(item: CartItem): CartItem | null {
  const p = getProduct(item.id);
  return p ? { ...item, name: p.name, price: p.price, image: p.image } : null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider initialItems={EXAMPLE_CART} refreshItem={refreshItem}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
