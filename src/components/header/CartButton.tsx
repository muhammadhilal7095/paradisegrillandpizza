import { forwardRef, type MouseEvent } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { CART_DRAWER_ID } from "./CartDrawer";
import { IconButton } from "./IconButton";

interface CartButtonProps {
  expanded: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const CartButton = forwardRef<HTMLButtonElement, CartButtonProps>(function CartButton({ expanded, onClick }, ref) {
  const { quantity } = useCart();

  return (
    <IconButton
      ref={ref}
      label={`Cart, ${quantity} ${quantity === 1 ? "item" : "items"}`}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={CART_DRAWER_ID}
      onClick={onClick}
      className="relative"
    >
      <ShoppingCart size={20} strokeWidth={1.8} />
      {quantity > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] leading-none font-bold text-white tabular-nums ring-2 ring-white"
        >
          {quantity > 99 ? "99+" : quantity}
        </span>
      )}
    </IconButton>
  );
});
