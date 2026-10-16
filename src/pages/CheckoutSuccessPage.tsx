import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { WhatsAppIcon } from "../components/cart/WhatsAppIcon";
import { buttonClasses } from "../components/ui/button";
import { PageTitleBar } from "../components/ui/PageTitleBar";
import { WHATSAPP_NUMBER } from "../config/ordering";
import { BRAND } from "../config/site";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/menu";
import { whatsappConfigured } from "../lib/order";
import { getPaymentResult, type PaymentResult } from "../lib/payments";
import { ACCOUNT_NOTE_KEY, AccountNote, Outcome, type Account } from "./CheckoutPage";

/** WhatsApp message for an order that has already been paid by card. */
function paidOrderMessage(r: PaymentResult) {
  const lines = [`Hello ${BRAND.name}, I've just PAID for an order online.`, `Payment reference: ${r.reference}`, ""];
  for (const item of r.items) lines.push(`${item.quantity} × ${item.name} – ${formatPrice(item.amount)}`);
  lines.push("", `Total paid: ${formatPrice(r.total)}`, `Order type: ${r.fulfilment === "delivery" ? "Delivery" : "Collection"}`);
  if (r.customer.name) lines.push(`Name: ${r.customer.name}`);
  if (r.customer.phone) lines.push(`Phone: ${r.customer.phone}`);
  if (r.address) lines.push(`Address: ${r.address}`);
  if (r.notes) lines.push(`Notes: ${r.notes}`);
  return lines.join("\n");
}

/**
 * Where Stripe sends the customer back. Only says "paid" after the server has confirmed the
 * payment with Stripe; the cart is cleared only then.
 */
export function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const { clear } = useCart();
  const [result, setResult] = useState<PaymentResult | null | "loading">("loading");
  const [account, setAccount] = useState<{ account: Account; email: string } | null>(null);
  const cleared = useRef(false);

  useEffect(() => {
    let live = true;
    if (!sessionId) return setResult(null);
    getPaymentResult(sessionId).then((r) => live && setResult(r));
    return () => {
      live = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (result === "loading" || !result?.paid || cleared.current) return;
    cleared.current = true;
    clear();
    try {
      const saved = sessionStorage.getItem(ACCOUNT_NOTE_KEY);
      if (saved) setAccount(JSON.parse(saved));
      sessionStorage.removeItem(ACCOUNT_NOTE_KEY);
    } catch {
      // Storage unavailable: skip the account note.
    }
  }, [result, clear]);

  if (result === "loading") {
    return (
      <main>
        <PageTitleBar title="Confirming payment" />
        <div role="status" className="flex flex-col items-center gap-3 py-24 text-[15px] text-muted">
          <LoaderCircle size={30} className="animate-spin text-brand" aria-hidden="true" />
          Checking your payment with Stripe…
        </div>
      </main>
    );
  }

  if (!result || !result.paid) {
    return (
      <main>
        <PageTitleBar title="Payment not completed" trail={[{ label: "Cart", to: "/cart" }]} />
        <Outcome
          icon={<CircleAlert size={30} strokeWidth={1.8} aria-hidden="true" />}
          title="Your payment wasn't completed"
          body={<p>You haven't been charged, and your cart is still saved. You can try again from checkout.</p>}
        >
          <Link to="/checkout" className={buttonClasses("primary", "md")}>
            Back to checkout
          </Link>
        </Outcome>
      </main>
    );
  }

  const whatsappHref = whatsappConfigured ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(paidOrderMessage(result))}` : null;

  return (
    <main>
      <PageTitleBar title="Order confirmed" />
      <Outcome
        icon={<CircleCheck size={30} strokeWidth={1.8} aria-hidden="true" />}
        title="Payment received. Thank you!"
        body={
          <>
            <p className="font-semibold text-ink">
              Payment reference: <span className="font-display tracking-wide">{result.reference}</span>
            </p>
            <ul className="mx-auto mt-2 max-w-sm divide-y divide-line rounded-xl border border-line bg-white text-left text-[14px]">
              {result.items.map((item, i) => (
                <li key={i} className="flex justify-between gap-3 px-4 py-2.5">
                  <span className="text-ink">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-semibold whitespace-nowrap text-ink">{formatPrice(item.amount)}</span>
                </li>
              ))}
              <li className="flex justify-between px-4 py-2.5 font-bold text-ink">
                <span>Total paid</span>
                <span>{formatPrice(result.total)}</span>
              </li>
            </ul>
            <p>
              {result.fulfilment === "delivery" ? "We'll deliver to " + (result.address || "your address") + "." : "We'll have it ready for collection."}{" "}
              We'll call {result.customer.phone || "you"} if there are any questions.
            </p>
            {whatsappHref && <p>To get your order to the kitchen even faster, send it to us on WhatsApp too.</p>}
            {account && <AccountNote account={account.account} email={account.email} />}
          </>
        }
      >
        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "md")}>
            <WhatsAppIcon className="size-[18px]" />
            Send order to the restaurant
            <span className="sr-only"> (opens WhatsApp in a new tab)</span>
          </a>
        )}
        <Link to="/" className={buttonClasses(whatsappHref ? "outlineDark" : "primary", "md")}>
          Back to home
        </Link>
      </Outcome>
    </main>
  );
}
