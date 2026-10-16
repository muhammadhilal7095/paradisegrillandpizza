import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { formatPrice, menuImage } from "../../../data/menu";
import { openCartDrawer } from "../../header/cartDrawerEvents";
import { buttonClasses } from "../../ui/button";

const step =
  "relative inline-flex size-7 items-center justify-center rounded-full text-ink transition-colors before:absolute before:-inset-1.5 hover:text-brand";

/** Compact live view of the shared cart. */
export function QuickOrderCart() {
  const { items, subtotal, setItemQuantity, removeItem } = useCart();

  return (
    <section aria-labelledby="quick-order-title" className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <ShoppingCart size={18} strokeWidth={2} aria-hidden="true" />
        </span>
        <div>
          <h2 id="quick-order-title" className="font-display text-[16px] leading-tight font-bold text-ink">
            Quick Order
          </h2>
          <p className="text-[12px] text-muted">Your favourites, faster!</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 rounded-xl bg-mist px-4 py-5 text-center text-[13px] text-muted">
          Your cart is empty. Tap <span className="font-semibold text-ink">Add to Cart</span> on anything you fancy.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2.5 py-2.5">
              <img
                src={menuImage(item.image)}
                alt=""
                width={44}
                height={44}
                loading="lazy"
                className="size-11 shrink-0 rounded-lg border border-line bg-white object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink" title={item.name}>
                  {item.name}
                </p>
                {item.options && item.options.length > 0 && (
                  <p className="truncate text-[11px] text-muted">{item.options.join(" · ")}</p>
                )}
                <p className="text-[12px] font-bold text-brand-dark">{formatPrice(item.price * item.quantity)}</p>
              </div>
              <div role="group" aria-label={`Quantity of ${item.name}`} className="flex items-center rounded-full border border-line">
                <button
                  type="button"
                  onClick={() => setItemQuantity(item.id, item.quantity - 1)}
                  aria-label={`Remove one ${item.name}`}
                  className={step}
                >
                  <Minus size={13} strokeWidth={2.2} />
                </button>
                <output className="w-5 text-center text-[12px] font-semibold tabular-nums">{item.quantity}</output>
                <button
                  type="button"
                  onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                  aria-label={`Add one ${item.name}`}
                  className={step}
                >
                  <Plus size={13} strokeWidth={2.2} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name} from cart`}
                className={`${step} text-muted`}
              >
                <X size={15} strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
        <span className="text-[13px] text-soft">Subtotal</span>
        <span className="text-[16px] font-bold text-ink">{formatPrice(subtotal)}</span>
      </div>
      {items.length > 0 ? (
        <Link to="/checkout" className={buttonClasses("primary", "md", "mt-3 w-full")}>
          Checkout
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={(e) => openCartDrawer(e.currentTarget)}
          aria-haspopup="dialog"
          className={buttonClasses("outlineDark", "md", "mt-3 w-full")}
        >
          View Cart
        </button>
      )}
    </section>
  );
}
