import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../data/menu";
import { CartLine } from "../cart/CartLine";
import { buttonClasses } from "../ui/button";
import { Drawer } from "./Drawer";

export const CART_DRAWER_ID = "cart-drawer";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Quick view of the cart from any page, with links to the full cart and checkout. */
export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, quantity, subtotal } = useCart();

  return (
    <Drawer
      id={CART_DRAWER_ID}
      open={open}
      onClose={onClose}
      label="Shopping cart"
      closeLabel="Close cart"
      heading={
        <h2 className="font-display text-[19px] font-bold tracking-[-0.3px] text-ink">
          Your cart <span className="text-[14px] font-semibold text-muted">({quantity})</span>
        </h2>
      }
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-mist text-brand">
            <ShoppingCart size={24} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <p className="mt-4 font-display text-[17px] font-bold text-ink">Your cart is empty</p>
          <p className="mt-1 text-[14px] text-muted">Add a pizza, some peri peri or a kebab to get started.</p>
          <Link to={ORDER_PATH} onClick={onClose} className={buttonClasses("primary", "md", "mt-6")}>
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="flex min-h-full flex-col">
          <ul className="divide-y divide-line px-5">
            {items.map((item) => (
              <CartLine key={item.id} item={item} />
            ))}
          </ul>

          <div className="mt-auto border-t border-line bg-mist p-5">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-soft">Subtotal</span>
              <span className="text-[18px] font-bold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-[12px] text-muted">Delivery fee (if any) is added at checkout.</p>
            <Link to="/checkout" onClick={onClose} className={buttonClasses("primary", "md", "mt-4 w-full")}>
              Go to checkout
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/cart" onClick={onClose} className={buttonClasses("outlineDark", "md", "mt-2 w-full bg-white")}>
              View full cart
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
