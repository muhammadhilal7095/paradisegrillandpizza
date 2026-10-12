import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Drawer } from "./Drawer";

export const CART_DRAWER_ID = "cart-drawer";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Placeholder cart drawer wired to the shared cart quantity until online ordering exists. */
export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { quantity, increment, decrement } = useCart();

  return (
    <Drawer
      id={CART_DRAWER_ID}
      open={open}
      onClose={onClose}
      label="Shopping cart"
      closeLabel="Close cart"
      heading={<h2 className="font-display text-[19px] font-extrabold tracking-[-0.4px] text-ink">Your cart</h2>}
    >
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-3 rounded-xl bg-mist p-4">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-white text-brand">
            <ShoppingCart size={19} strokeWidth={1.9} aria-hidden="true" />
          </span>
          <p className="flex-1 text-[14px] font-medium text-ink">
            {quantity === 0 ? "Your cart is empty" : `${quantity} ${quantity === 1 ? "item" : "items"} in your cart`}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span id="cart-qty-label" className="text-[14px] text-muted">
            Items
          </span>
          <div role="group" aria-labelledby="cart-qty-label" className="flex items-center rounded-full border border-line">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity === 0}
              aria-label="Remove one item"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-brand disabled:text-muted/40"
            >
              <Minus size={16} strokeWidth={2} />
            </button>
            <output aria-live="polite" className="w-8 text-center text-[15px] font-semibold tabular-nums">
              {quantity}
            </output>
            <button
              type="button"
              onClick={increment}
              aria-label="Add one item"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-brand"
            >
              <Plus size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed text-muted">Checkout will be available once online ordering launches.</p>

        <Link
          to="/menu"
          onClick={onClose}
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Browse the menu
        </Link>
      </div>
    </Drawer>
  );
}
