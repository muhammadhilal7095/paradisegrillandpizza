import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { useCart, type CartItemInput } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { defaultSelections, describeSelections, lineId, productImageName, unitPrice, type Product } from "../../data/menu";
import { ProductOptionsDialog } from "../menu/ProductOptionsDialog";
import { buttonClasses } from "./button";

interface AddToCartButtonProps {
  product: Product;
  label?: string;
  size?: "xs" | "sm" | "md";
  /** Adds a trailing arrow (Order Now →). */
  arrow?: boolean;
  /** Adds a leading plus (compact "+ Add" buttons on menu rows). */
  plus?: boolean;
  className?: string;
}

/** Ignores a second click this soon after the first (accidental double-click). */
const DOUBLE_CLICK_MS = 400;

/** Adds straight to the cart, or opens the options dialog when the product has sizes or extras. */
export function AddToCartButton({ product, label = "Add to Cart", size = "sm", arrow = false, plus = false, className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const notify = useToast();
  const [added, setAdded] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const lastClick = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasOptions = (product.options?.length ?? 0) > 0;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const add = (item: CartItemInput, quantity = 1) => {
    addItem(item, quantity);
    notify(`${quantity > 1 ? `${quantity} × ` : ""}${item.name} added to cart`);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1400);
  };

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClick.current < DOUBLE_CLICK_MS) return;
    lastClick.current = now;

    if (hasOptions) return setChoosing(true);
    const selections = defaultSelections(product);
    add({
      id: lineId(product, selections),
      productId: product.id,
      name: product.name,
      price: unitPrice(product, selections),
      image: productImageName(product),
      options: describeSelections(product, selections),
      selections,
    });
  };

  const closeDialog = () => {
    setChoosing(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-haspopup={hasOptions ? "dialog" : undefined}
        className={buttonClasses("primary", size, className)}
      >
        {added && <Check size={15} strokeWidth={2.4} aria-hidden="true" />}
        {plus && !added && <Plus size={15} strokeWidth={2.6} aria-hidden="true" />}
        {added ? "Added" : hasOptions && label === "Add to Cart" ? "Choose options" : label}
        {arrow && !added && <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />}
        <span className="sr-only"> – {product.name}</span>
      </button>
      {choosing && (
        <ProductOptionsDialog
          product={product}
          onClose={closeDialog}
          onAdd={(item, quantity) => {
            add(item, quantity);
            closeDialog();
          }}
        />
      )}
    </>
  );
}
