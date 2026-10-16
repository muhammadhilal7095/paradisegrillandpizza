import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import { CartLine } from "../components/cart/CartLine";
import { OrderSummary } from "../components/cart/OrderSummary";
import { WhatsAppIcon } from "../components/cart/WhatsAppIcon";
import { buttonClasses } from "../components/ui/button";
import { PageTitleBar } from "../components/ui/PageTitleBar";
import { ORDER_PATH } from "../config/site";
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/menuStore";
import { buildOrderMessage, orderTotals, whatsappConfigured, whatsappUrl } from "../lib/order";

const container = "mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8";

export function CartPage() {
  const { items, quantity, subtotal } = useCart();
  const { categories } = useMenu();
  const totals = orderTotals(subtotal, "collection");

  return (
    <main>
      <PageTitleBar title="Your Cart" description="Check your order, then head to checkout or send it to us on WhatsApp." />

      {items.length === 0 ? (
        <div className={`${container} py-14 md:py-20`}>
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-mist text-brand">
              <ShoppingCart size={28} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-[24px] font-bold text-ink">Your cart is empty</h2>
            <p className="mt-2 text-[15px] text-muted">Pick something tasty from the menu and it will appear here.</p>
            <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-6")}>
              Browse the menu
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Popular categories">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link to={`/menu/${c.id}`} className={buttonClasses("outlineDark", "sm")}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className={`${container} grid gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start`}>
          <section aria-labelledby="cart-items-title">
            <div className="flex items-baseline justify-between">
              <h2 id="cart-items-title" className="font-display text-[20px] font-bold text-ink">
                {quantity} {quantity === 1 ? "item" : "items"}
              </h2>
              <Link to={ORDER_PATH} className="inline-flex min-h-10 items-center gap-1.5 text-[14px] font-semibold text-brand-dark hover:text-ink">
                <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
                Keep shopping
              </Link>
            </div>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {items.map((item) => (
                <CartLine key={item.id} item={item} large />
              ))}
            </ul>
          </section>

          <div className="lg:sticky lg:top-24">
            <OrderSummary totals={totals} itemCount={quantity}>
              <Link to="/checkout" className={buttonClasses("primary", "md", "mt-5 w-full")}>
                Go to checkout
                <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </Link>
              {whatsappConfigured && (
                <a
                  href={whatsappUrl(buildOrderMessage(items, totals))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("outlineDark", "md", "mt-2 w-full")}
                >
                  <WhatsAppIcon className="size-[18px] text-[#128c4b]" />
                  Quick order on WhatsApp
                  <span className="sr-only"> (opens WhatsApp in a new tab)</span>
                </a>
              )}
              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                You'll add your name, phone and collection or delivery details at checkout.
              </p>
            </OrderSummary>
          </div>
        </div>
      )}
    </main>
  );
}
