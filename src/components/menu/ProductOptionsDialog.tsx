import { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import {
  defaultSelections,
  describeSelections,
  formatPrice,
  lineId,
  menuImage,
  menuSrcSet,
  productImageName,
  unitPrice,
  type Product,
  type Selections,
} from "../../data/menu";
import type { CartItemInput } from "../../context/CartContext";
import { buttonClasses } from "../ui/button";
import { fallbackImage } from "./imageFallback";

interface ProductOptionsDialogProps {
  product: Product;
  onClose: () => void;
  onAdd: (item: CartItemInput, quantity: number) => void;
}

const step = "inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:text-brand disabled:opacity-40";

/** Modal for choosing size, heat, sauces and extras before adding to the cart. Uses the native <dialog>. */
export function ProductOptionsDialog({ product, onClose, onAdd }: ProductOptionsDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [selections, setSelections] = useState<Selections>(() => defaultSelections(product));
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Guarded: StrictMode runs this twice. Closing here would fire onClose, so unmounting removes it instead.
    if (!dialog.open) dialog.showModal();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const pick = (groupId: string, choiceId: string, multi: boolean) =>
    setSelections((current) => {
      const chosen = current[groupId] ?? [];
      if (!multi) return { ...current, [groupId]: [choiceId] };
      return { ...current, [groupId]: chosen.includes(choiceId) ? chosen.filter((c) => c !== choiceId) : [...chosen, choiceId] };
    });

  const price = unitPrice(product, selections);
  const image = productImageName(product);

  const handleAdd = () => {
    onAdd(
      {
        id: lineId(product, selections),
        productId: product.id,
        name: product.name,
        price,
        image,
        options: describeSelections(product, selections),
        selections,
      },
      quantity,
    );
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[min(92svh,760px)] w-[min(34rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white p-0 text-ink shadow-[0_24px_60px_-20px_rgba(5,5,5,0.5)] backdrop:bg-ink/50"
    >
      <div className="flex max-h-[inherit] flex-col">
        <div className="relative shrink-0">
          <img
            src={menuImage(image, 540)}
            srcSet={menuSrcSet(image)}
            onError={fallbackImage(product)}
            sizes="34rem"
            alt=""
            width={540}
            height={540}
            className="aspect-[16/10] w-full bg-white object-contain"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-white text-ink shadow transition-colors hover:text-brand"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-2">
          <h2 id={titleId} className="font-display text-[22px] leading-tight font-bold">
            {product.name}
          </h2>
          {product.description && <p className="mt-1 text-[14px] leading-relaxed text-muted">{product.description}</p>}

          {product.options?.map((group) => {
            const multi = group.type === "multi";
            return (
              <fieldset key={group.id} className="mt-5">
                <legend className="flex w-full items-baseline justify-between text-[15px] font-semibold">
                  {group.label}
                  <span className="text-[12px] font-normal text-muted">{multi ? "Optional" : "Choose 1"}</span>
                </legend>
                <div className="mt-2 grid gap-2">
                  {group.choices.map((choice) => {
                    const checked = selections[group.id]?.includes(choice.id) ?? false;
                    return (
                      <label
                        key={choice.id}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 text-[14px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                          checked ? "border-brand bg-blush" : "border-line hover:border-ink/30"
                        }`}
                      >
                        <input
                          type={multi ? "checkbox" : "radio"}
                          name={`${product.id}-${group.id}`}
                          checked={checked}
                          onChange={() => pick(group.id, choice.id, multi)}
                          className="size-[18px] shrink-0 accent-[var(--color-brand)]"
                        />
                        <span className="flex-1">{choice.label}</span>
                        {choice.price ? <span className="text-muted">+{formatPrice(choice.price)}</span> : null}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-line p-4">
          <div role="group" aria-label="Quantity" className="flex items-center rounded-full border border-line">
            <button type="button" onClick={() => setQuantity((q) => q - 1)} disabled={quantity <= 1} aria-label="One fewer" className={step}>
              <Minus size={16} strokeWidth={2} />
            </button>
            <output aria-live="polite" className="w-6 text-center text-[15px] font-semibold tabular-nums">
              {quantity}
            </output>
            <button type="button" onClick={() => setQuantity((q) => Math.min(20, q + 1))} aria-label="One more" className={step}>
              <Plus size={16} strokeWidth={2} />
            </button>
          </div>
          <button type="button" onClick={handleAdd} className={buttonClasses("primary", "md", "flex-1")}>
            Add to cart · {formatPrice(price * quantity)}
          </button>
        </div>
      </div>
    </dialog>
  );
}
