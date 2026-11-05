import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { buttonClasses } from "../components/ui/button";
import { PageTitleBar } from "../components/ui/PageTitleBar";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/menu";
import { getPaymentResult, type PaymentResult } from "../lib/payments";
import { ACCOUNT_NOTE_KEY, AccountNote, Outcome, type Account } from "./CheckoutPage";

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
    // Google Ads purchase conversion ("Purchase (1)"). transaction_id stops a reload from counting the same order twice.
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", "conversion", {
      send_to: "AW-18556518542/ZjFFCP2Z8bIdEI6BuJBF",
      value: result.total / 100,
      currency: "GBP",
      transaction_id: result.reference,
    });
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
            {account && <AccountNote account={account.account} email={account.email} />}
          </>
        }
      >
        <Link to="/" className={buttonClasses("primary", "md")}>
          Back to home
        </Link>
      </Outcome>
    </main>
  );
}
