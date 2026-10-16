import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../data/menu";

/** Basket bar fixed to the bottom of the screen on phones and tablets while the cart has items. */
export function MobileCartBar() {
  const { quantity, subtotal } = useCart();
  if (quantity === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur desk:hidden">
      <Link
        to="/cart"
        className="mx-auto flex h-12 max-w-xl items-center gap-3 rounded-full bg-brand px-4 text-white shadow-[0_10px_24px_-12px_rgba(224,48,30,0.7)] transition-colors hover:bg-brand-dark"
      >
        <span className="relative inline-flex">
          <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" />
          <span className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-brand tabular-nums">
            {quantity}
          </span>
        </span>
        <span className="flex-1 text-[15px] font-semibold">
          View basket <span className="sr-only">, {quantity} {quantity === 1 ? "item" : "items"}</span>
        </span>
        <span className="text-[15px] font-bold tabular-nums">{formatPrice(subtotal)}</span>
        <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </div>
  );
}
