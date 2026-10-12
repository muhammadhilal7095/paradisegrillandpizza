import type { MouseEvent } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { CART_DRAWER_ID } from "./CartDrawer";

interface CartButtonProps {
  expanded: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function CartButton({ expanded, onClick }: CartButtonProps) {
  const { quantity } = useCart();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cart, ${quantity} ${quantity === 1 ? "item" : "items"}`}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={CART_DRAWER_ID}
      className="ml-1 inline-flex h-[34px] min-w-[58px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand px-3.5 text-white transition-colors duration-200 hover:bg-brand-dark aria-expanded:bg-brand-dark"
    >
      <ShoppingCart size={18} strokeWidth={2} aria-hidden="true" />
      <span aria-hidden="true" className="text-[13px] leading-none font-semibold tabular-nums">
        {quantity > 99 ? "99+" : quantity}
      </span>
    </button>
  );
}
