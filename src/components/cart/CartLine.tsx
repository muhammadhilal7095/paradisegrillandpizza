import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartItem } from "../../context/CartContext";
import { formatPrice, menuImage } from "../../data/menu";

const stepButton =
  "inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-brand md:size-9";

/** One cart row: photo, name, options, quantity stepper, line total and remove. */
export function CartLine({ item, large = false }: { item: CartItem; large?: boolean }) {
  const { setItemQuantity, removeItem } = useCart();
  const img = large ? "size-20 md:size-24" : "size-16";

  return (
    <li className="flex gap-3 py-4 md:gap-4">
      <img
        src={menuImage(item.image)}
        alt=""
        width={96}
        height={96}
        loading="lazy"
        className={`${img} shrink-0 rounded-lg border border-line bg-white object-contain`}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className={`leading-snug font-semibold text-ink ${large ? "text-[15px] md:text-[16px]" : "text-[14px]"}`}>{item.name}</p>
          <p className="text-[14px] font-bold whitespace-nowrap text-ink md:text-[15px]">{formatPrice(item.price * item.quantity)}</p>
        </div>
        {item.options && item.options.length > 0 && (
          <p className="mt-0.5 text-[12px] leading-snug text-soft">{item.options.join(" · ")}</p>
        )}
        <p className="text-[12px] text-muted">{formatPrice(item.price)} each</p>
        <div className="mt-2 flex items-center justify-between">
          <div role="group" aria-label={`Quantity of ${item.name}`} className="flex items-center rounded-full border border-line">
            <button
              type="button"
              onClick={() => setItemQuantity(item.id, item.quantity - 1)}
              aria-label={item.quantity === 1 ? `Remove ${item.name}` : `Remove one ${item.name}`}
              className={stepButton}
            >
              <Minus size={15} strokeWidth={2} />
            </button>
            <output aria-live="polite" className="w-7 text-center text-[14px] font-semibold tabular-nums">
              {item.quantity}
            </output>
            <button
              type="button"
              onClick={() => setItemQuantity(item.id, Math.min(99, item.quantity + 1))}
              aria-label={`Add one ${item.name}`}
              className={stepButton}
            >
              <Plus size={15} strokeWidth={2} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-[13px] text-muted transition-colors hover:text-brand"
          >
            <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
            <span className={large ? "" : "sr-only"}>Remove</span>
            <span className="sr-only"> {item.name} from cart</span>
          </button>
        </div>
      </div>
    </li>
  );
}
