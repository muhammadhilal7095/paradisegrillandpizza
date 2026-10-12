import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useCart, type CartItemInput } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { buttonClasses } from "./button";

interface AddToCartButtonProps {
  item: CartItemInput;
  label?: string;
  className?: string;
}

/** Ignores a second click this soon after the first (accidental double-click). */
const DOUBLE_CLICK_MS = 400;

export function AddToCartButton({ item, label = "Add to Cart", className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const notify = useToast();
  const [added, setAdded] = useState(false);
  const lastClick = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClick.current < DOUBLE_CLICK_MS) return;
    lastClick.current = now;

    addItem(item);
    notify(`${item.name} added to cart`);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button type="button" onClick={handleClick} className={buttonClasses("primary", "sm", className)}>
      {added && <Check size={15} strokeWidth={2.4} aria-hidden="true" />}
      {added ? "Added" : label}
      <span className="sr-only"> – {item.name}</span>
    </button>
  );
}
