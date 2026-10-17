import { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../data/menu";
import { dealLineId, type SpecialDeal } from "../../lib/deals";
import { buttonClasses } from "../ui/button";

const step = "inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:text-brand disabled:opacity-40";

/** Lets the customer pick one item per deal slot (and a flavour where offered), then adds the deal to the cart. */
export function DealBuilderDialog({ deal, onClose }: { deal: SpecialDeal; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { addItem } = useCart();
  const notify = useToast();
  // slotId → choiceId; "<slotId>:addon" → addonId
  const [picks, setPicks] = useState<Record<string, string>>(() =>
    Object.fromEntries(deal.slots.filter((s) => s.choices.length === 1).map((s) => [s.id, s.choices[0].id])),
  );
  const [quantity, setQuantity] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  // Pre-select the only flavour when there is just one.
  useEffect(() => {
    for (const slot of deal.slots) {
      const choice = slot.choices.find((c) => c.id === picks[slot.id]);
      if (choice?.addons.length === 1 && !picks[`${slot.id}:addon`]) setPicks((p) => ({ ...p, [`${slot.id}:addon`]: choice.addons[0].id }));
    }
  }, [picks, deal.slots]);

  const missing = deal.slots.filter((slot) => {
    const choice = slot.choices.find((c) => c.id === picks[slot.id]);
    return !choice || (choice.addons.length > 0 && !picks[`${slot.id}:addon`]);
  });

  const handleAdd = () => {
    if (deal.price === null) return;
    if (missing.length) {
      setShowErrors(true);
      return;
    }
    const selections: Record<string, string[]> = {};
    const labels: string[] = [];
    for (const slot of deal.slots) {
      const choice = slot.choices.find((c) => c.id === picks[slot.id])!;
      selections[slot.id] = [choice.id];
      const addon = choice.addons.find((a) => a.id === picks[`${slot.id}:addon`]);
      if (addon) selections[`${slot.id}:addon`] = [addon.id];
      labels.push(`${slot.quantity > 1 ? `${slot.quantity} × ` : ""}${choice.label}${addon ? ` – ${addon.label}` : ""}`);
    }
    addItem(
      {
        id: dealLineId(deal.id, selections),
        productId: `deal-${deal.id}`,
        name: deal.title,
        price: deal.price,
        image: deal.bannerUrl ?? "/images/brand/logo-512.webp",
        options: labels,
        selections,
      },
      quantity,
    );
    notify(`${quantity > 1 ? `${quantity} × ` : ""}${deal.title} added to cart`);
    onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[min(92svh,820px)] w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white p-0 text-ink shadow-[0_24px_60px_-20px_rgba(5,5,5,0.5)] backdrop:bg-ink/50"
    >
      <div className="flex max-h-[inherit] flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">Build your deal</p>
            <h2 id={titleId} className="mt-1 font-display text-[21px] leading-tight font-bold">
              {deal.title}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-mist hover:text-brand">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-5">
          {deal.slots.map((slot, i) => {
            const chosen = slot.choices.find((c) => c.id === picks[slot.id]);
            const error = showErrors && missing.includes(slot);
            return (
              <fieldset key={slot.id} className={i > 0 ? "mt-6" : ""} aria-invalid={error || undefined}>
                <legend className="flex w-full items-baseline justify-between text-[15px] font-semibold">
                  <span>
                    {i + 1}. {slot.quantity > 1 ? `${slot.quantity} × ` : ""}
                    {slot.name}
                  </span>
                  <span className={`text-[12px] font-medium ${error ? "text-brand-dark" : "text-muted"}`}>{error ? "Please choose" : "Choose 1"}</span>
                </legend>
                <div className="mt-2 grid gap-2">
                  {slot.choices.map((choice) => {
                    const checked = picks[slot.id] === choice.id;
                    return (
                      <label
                        key={choice.id}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-[14px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                          checked ? "border-brand bg-blush" : "border-line hover:border-ink/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`deal-${deal.id}-${slot.id}`}
                          checked={checked}
                          onChange={() => setPicks((p) => ({ ...p, [slot.id]: choice.id, [`${slot.id}:addon`]: "" }))}
                          className="size-[18px] shrink-0 accent-[var(--color-brand)]"
                        />
                        {choice.imageUrl && <img src={choice.imageUrl} alt="" width={40} height={40} decoding="async" onError={(e) => e.currentTarget.remove()} className="size-10 shrink-0 rounded-lg bg-white object-contain" />}
                        <span className="flex-1">{choice.label}</span>
                      </label>
                    );
                  })}
                </div>
                {chosen && chosen.addons.length > 0 && (
                  <div className="mt-3 rounded-xl bg-mist p-3">
                    <p className="text-[13px] font-semibold">Choose a flavour</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {chosen.addons.map((a) => {
                        const on = picks[`${slot.id}:addon`] === a.id;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setPicks((p) => ({ ...p, [`${slot.id}:addon`]: a.id }))}
                            className={`min-h-10 rounded-full border px-4 text-[13px] font-semibold transition-colors ${
                              on ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-ink/30"
                            }`}
                          >
                            {a.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
            Add deal · {deal.price !== null ? formatPrice(deal.price * quantity) : ""}
          </button>
        </div>
      </div>
    </dialog>
  );
}
