import type { ReactNode } from "react";
import { ORDERING, ORDERING_SETTINGS_VERIFIED, type Fulfilment } from "../../config/ordering";
import { formatPrice, formatShortPrice } from "../../data/menu";
import type { OrderTotals } from "../../lib/order";

interface OrderSummaryProps {
  totals: OrderTotals;
  /** Unknown on the cart page (fee shown as a note); known at checkout. */
  fulfilment?: Fulfilment;
  itemCount: number;
  children?: ReactNode;
}

/** Totals panel shared by the cart and checkout pages. */
export function OrderSummary({ totals, fulfilment, itemCount, children }: OrderSummaryProps) {
  const { delivery } = ORDERING;
  return (
    <section aria-labelledby="order-summary-title" className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <h2 id="order-summary-title" className="font-display text-[19px] font-bold text-ink">
        Order summary
      </h2>
      <dl className="mt-4 space-y-2.5 text-[14px]">
        <div className="flex justify-between">
          <dt className="text-soft">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="font-semibold text-ink">{formatPrice(totals.subtotal)}</dd>
        </div>
        {fulfilment === "delivery" && (
          <div className="flex justify-between">
            <dt className="text-soft">Delivery</dt>
            <dd className="font-semibold text-ink">{totals.deliveryFee ? formatPrice(totals.deliveryFee) : "Free"}</dd>
          </div>
        )}
        {fulfilment === "collection" && (
          <div className="flex justify-between">
            <dt className="text-soft">Collection</dt>
            <dd className="font-semibold text-ink">Free</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="font-semibold text-ink">Total</dt>
          <dd className="font-display text-[22px] font-bold text-ink">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      {!fulfilment && delivery.enabled && (
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          Delivery {formatShortPrice(delivery.fee)}
          {delivery.freeFrom !== null && <>, free over {formatShortPrice(delivery.freeFrom)}</>}. Minimum delivery order {formatShortPrice(delivery.minimumOrder)}.
          Collection is free.
        </p>
      )}
      {!ORDERING_SETTINGS_VERIFIED && (
        <p className="mt-2 text-[11px] text-muted">Sample prices and fees, to be confirmed by the restaurant.</p>
      )}
      {children}
    </section>
  );
}
