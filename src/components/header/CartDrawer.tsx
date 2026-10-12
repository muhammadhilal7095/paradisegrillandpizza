import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { ORDER_PATH } from "../../config/site";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../data/menu";
import { buttonClasses } from "../ui/button";
import { Drawer } from "./Drawer";

export const CART_DRAWER_ID = "cart-drawer";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const stepButton =
  "inline-flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:text-brand";

/** Cart contents. There is no online checkout yet, so it ends with a clear next step instead. */
export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, quantity, subtotal, setItemQuantity, removeItem } = useCart();

  return (
    <Drawer
      id={CART_DRAWER_ID}
      open={open}
      onClose={onClose}
      label="Shopping cart"
      closeLabel="Close cart"
      heading={
        <h2 className="font-display text-[19px] font-extrabold tracking-[-0.4px] text-ink">
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
          <p className="mt-1 text-[14px] text-muted">Add something tasty from the menu.</p>
          <Link to={ORDER_PATH} onClick={onClose} className={buttonClasses("primary", "md", "mt-6")}>
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="flex min-h-full flex-col">
          <ul className="divide-y divide-line px-5">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 py-4">
                <img
                  src={item.image}
                  alt=""
                  width={64}
                  height={64}
                  className="size-16 shrink-0 rounded-lg bg-mist object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] leading-snug font-semibold text-ink">{item.name}</p>
                    <p className="text-[14px] font-bold whitespace-nowrap text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <p className="text-[12px] text-muted">{formatPrice(item.price)} each</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div
                      role="group"
                      aria-label={`Quantity of ${item.name}`}
                      className="flex items-center rounded-full border border-line"
                    >
                      <button
                        type="button"
                        onClick={() => setItemQuantity(item.id, item.quantity - 1)}
                        aria-label={`Remove one ${item.name}`}
                        className={stepButton}
                      >
                        <Minus size={15} strokeWidth={2} />
                      </button>
                      <output className="w-7 text-center text-[14px] font-semibold tabular-nums">{item.quantity}</output>
                      <button
                        type="button"
                        onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                        aria-label={`Add one ${item.name}`}
                        className={stepButton}
                      >
                        <Plus size={15} strokeWidth={2} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:text-brand"
                    >
                      <Trash2 size={17} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-auto border-t border-line bg-mist p-5">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-soft">Subtotal</span>
              <span className="text-[18px] font-bold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Online checkout isn't available yet — this cart keeps your picks while you browse.
            </p>
            <Link to={ORDER_PATH} onClick={onClose} className={buttonClasses("outlineDark", "md", "mt-4 w-full bg-white")}>
              Continue browsing
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
