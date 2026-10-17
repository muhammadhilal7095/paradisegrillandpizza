import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Bike, CircleAlert, CircleCheck, KeyRound, LoaderCircle, Lock, Mail, MapPin, Phone, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import { AuthField } from "../components/auth/AuthField";
import { FormAlert } from "../components/auth/FormAlert";
import { OrderSummary } from "../components/cart/OrderSummary";
import { WhatsAppIcon } from "../components/cart/WhatsAppIcon";
import { buttonClasses } from "../components/ui/button";
import { PageTitleBar } from "../components/ui/PageTitleBar";
import { CONTACT } from "../config/contact";
import { ORDERING, type Fulfilment } from "../config/ordering";
import { ORDER_PATH } from "../config/site";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ApiError } from "../lib/api";
import { formatPrice, formatShortPrice, menuImage } from "../data/menu";
import {
  availableFulfilments,
  buildOrderMessage,
  onlineOrderingConfigured,
  orderTotals,
  submitOrder,
  validateCheckout,
  whatsappConfigured,
  whatsappUrl,
  type CheckoutDetails,
  type CheckoutErrors,
} from "../lib/order";
import { cardPaymentsEnabled, startCardPayment } from "../lib/payments";

/** sessionStorage key: what happened to the account, shown again after returning from Stripe. */
export const ACCOUNT_NOTE_KEY = "paradise-account-note";

/** What happened to the customer's account when they ordered. */
export type Account = "existing" | "created" | "created-no-password" | "email-taken" | "failed";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "placed"; reference?: string; account: Account }
  | { kind: "whatsapp"; url: string; account: Account };

const FIELD_ORDER: (keyof CheckoutDetails)[] = ["name", "phone", "email", "password", "fulfilment", "address", "postcode", "notes"];

/** Random password for accounts created without one; the customer sets their own via "Forgot password". */
function randomPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes)).replace(/[^a-zA-Z0-9]/g, "").slice(0, 20) + "9a";
}
const container = "mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8";
const FULFILMENT_ICONS = { collection: ShoppingBag, delivery: Bike } as const;

export function CheckoutPage() {
  const { items, quantity, subtotal, clear } = useCart();
  const { status: authStatus, user, register } = useAuth();
  const guest = authStatus !== "authenticated";
  const fulfilments = availableFulfilments();
  const [details, setDetails] = useState<CheckoutDetails>({
    name: "",
    phone: "",
    email: "",
    fulfilment: fulfilments[0] ?? "collection",
    address: "",
    postcode: "",
    notes: "",
    password: "",
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [submitError, setSubmitError] = useState("");
  const fieldRefs = useRef<Partial<Record<keyof CheckoutDetails, HTMLElement | null>>>({});
  const notesId = useId();
  const fulfilmentErrorId = useId();

  // Logged-in customers: fill in what the account already knows.
  useEffect(() => {
    if (!user) return;
    setDetails((d) => ({ ...d, name: d.name || user.name, email: d.email || user.email, phone: d.phone || user.phone || "" }));
  }, [user]);

  const totals = orderTotals(subtotal, details.fulfilment);
  const [cardPay, setCardPay] = useState(false);
  const [params] = useSearchParams();
  const paymentCancelled = params.get("payment") === "cancelled";
  useEffect(() => {
    let live = true;
    cardPaymentsEnabled().then((on) => live && setCardPay(on));
    return () => {
      live = false;
    };
  }, []);
  const canOrder = cardPay || whatsappConfigured || onlineOrderingConfigured;

  const set = <K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) => {
    setDetails((d) => ({ ...d, [key]: value }));
    if (errors[key] || (key === "fulfilment" && errors.fulfilment)) setErrors((e) => ({ ...e, [key]: undefined, fulfilment: undefined }));
  };

  /** Validates; focuses the first problem. */
  const check = () => {
    const found = validateCheckout(details, subtotal, { guest });
    setErrors(found);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) fieldRefs.current[first]?.focus();
    return !first;
  };

  /**
   * Guests get an account created from their checkout details (and are logged in). An existing account
   * or a failure never blocks the order: the order is what matters, the account is a bonus.
   */
  const ensureAccount = async (): Promise<Account> => {
    if (!guest) return "existing";
    const chosen = details.password;
    const password = chosen || randomPassword();
    const input = { name: details.name.trim(), email: details.email.trim(), phone: details.phone.trim(), password, password_confirmation: password };
    try {
      await register(input);
    } catch (error) {
      if (!(error instanceof ApiError) || error.kind !== "validation") return "failed";
      if (error.fieldErrors.email) return "email-taken";
      // The account service may format phone numbers differently: try once without it.
      if (error.fieldErrors.phone) {
        try {
          await register({ ...input, phone: "" });
        } catch {
          return "failed";
        }
      } else return "failed";
    }
    return chosen ? "created" : "created-no-password";
  };

  const handleWhatsApp = async () => {
    setSubmitError("");
    if (!check()) return;
    // A tab opened right in the click is allowed by pop-up blockers; it's pointed at WhatsApp once the account step is done.
    const tab = window.open("", "_blank");
    setStatus({ kind: "submitting" });
    const account = await ensureAccount();
    const url = whatsappUrl(buildOrderMessage(items, totals, details));
    if (tab && !tab.closed) {
      tab.opener = null;
      tab.location.href = url;
    }
    setStatus({ kind: "whatsapp", url, account });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Card payment: create the account (guests), then hand over to Stripe's secure payment page. */
  const handleCardPayment = async () => {
    setSubmitError("");
    if (!check()) return;
    setStatus({ kind: "submitting" });
    const account = await ensureAccount();
    try {
      sessionStorage.setItem(ACCOUNT_NOTE_KEY, JSON.stringify({ account, email: details.email.trim() }));
    } catch {
      // Storage blocked: the confirmation page just won't mention the account.
    }
    const result = await startCardPayment(items, details);
    if ("url" in result) {
      window.location.assign(result.url);
      return; // Stay in the "submitting" state while the browser leaves for Stripe.
    }
    setSubmitError(result.error);
    setStatus({ kind: "idle" });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (cardPay) return handleCardPayment();
    if (!onlineOrderingConfigured) {
      if (whatsappConfigured) handleWhatsApp();
      else check();
      return;
    }
    setSubmitError("");
    if (!check()) return;
    setStatus({ kind: "submitting" });
    const account = await ensureAccount();
    const result = await submitOrder(items, totals, details);
    if (result.ok) {
      clear();
      setStatus({ kind: "placed", reference: result.reference, account });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitError(result.message);
      setStatus({ kind: "idle" });
    }
  };

  // ----- Outcome screens -----

  if (status.kind === "placed") {
    return (
      <main>
        <PageTitleBar title="Order received" trail={[{ label: "Cart", to: "/cart" }]} />
        <Outcome
          icon={<CircleCheck size={30} strokeWidth={1.8} aria-hidden="true" />}
          title="Thank you, your order has been received"
          body={
            <>
              {status.reference && (
                <p className="font-semibold text-ink">
                  Order reference: <span className="font-display">{status.reference}</span>
                </p>
              )}
              <p>
                The restaurant's ordering system accepted your order. We'll call {details.phone.trim()} if there are any questions.
              </p>
              <AccountNote account={status.account} email={details.email.trim()} />
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

  if (status.kind === "whatsapp") {
    return (
      <main>
        <PageTitleBar title="Send your order" trail={[{ label: "Cart", to: "/cart" }]} />
        <Outcome
          icon={<WhatsAppIcon className="size-8" />}
          title="Finish your order in WhatsApp"
          body={
            <>
              <p>
                WhatsApp should now be open with your order typed out. <strong className="text-ink">Press send in WhatsApp</strong> to send it to us.
              </p>
              <p>
                Your order is <strong className="text-ink">not confirmed</strong> until the restaurant replies to confirm it and the total.
              </p>
              <AccountNote account={status.account} email={details.email.trim()} />
            </>
          }
        >
          <a href={status.url} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "md")}>
            <WhatsAppIcon className="size-[18px]" />
            Open WhatsApp again
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button type="button" onClick={() => setStatus({ kind: "idle" })} className={buttonClasses("outlineDark", "md")}>
            Edit my details
          </button>
          <button
            type="button"
            onClick={() => {
              clear();
              setStatus({ kind: "idle" });
            }}
            className="inline-flex min-h-11 items-center px-3 text-[14px] font-semibold text-brand-dark underline-offset-4 hover:underline"
          >
            I've sent it, clear my cart
          </button>
        </Outcome>
      </main>
    );
  }

  // ----- Empty cart -----

  if (items.length === 0) {
    return (
      <main>
        <PageTitleBar title="Checkout" trail={[{ label: "Cart", to: "/cart" }]} />
        <Outcome
          icon={<ShoppingCart size={28} strokeWidth={1.8} aria-hidden="true" />}
          title="Your cart is empty"
          body={<p>Add some food to your cart before checking out.</p>}
        >
          <Link to={ORDER_PATH} className={buttonClasses("primary", "md")}>
            Browse the menu
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </Outcome>
      </main>
    );
  }

  // ----- Form -----

  const submitting = status.kind === "submitting";
  const delivery = details.fulfilment === "delivery";

  return (
    <main>
      <PageTitleBar title="Checkout" trail={[{ label: "Cart", to: "/cart" }]} description="A few details and your order is on its way to us." />

      <form noValidate onSubmit={handleSubmit} className={`${container} grid grid-cols-[minmax(0,1fr)] gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start`}>
        <div className="flex flex-col gap-6">
          {paymentCancelled && (
            <FormAlert tone="info">
              <p className="font-semibold text-ink">Payment cancelled. You haven't been charged.</p>
              <p className="mt-0.5">Your order is still here. Check your details and try again when you're ready.</p>
            </FormAlert>
          )}
          {!canOrder && (
            <FormAlert tone="info">
              <p className="font-semibold text-ink">Online ordering isn't switched on yet.</p>
              <p className="mt-0.5">
                You can still check your order here. To order now, please call us on {CONTACT.phones[0]}.
              </p>
            </FormAlert>
          )}

          <Panel title="Your details" step={1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField
                ref={(el) => {
                  fieldRefs.current.name = el;
                }}
                label="Full name"
                icon={UserRound}
                autoComplete="name"
                value={details.name}
                onValueChange={(v) => set("name", v)}
                error={errors.name}
                maxLength={80}
                className="sm:col-span-2"
              />
              <AuthField
                ref={(el) => {
                  fieldRefs.current.phone = el;
                }}
                label="Phone number"
                icon={Phone}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={details.phone}
                onValueChange={(v) => set("phone", v)}
                error={errors.phone}
                hint="We'll only call about this order."
                maxLength={20}
              />
              <AuthField
                ref={(el) => {
                  fieldRefs.current.email = el;
                }}
                label="Email"
                icon={Mail}
                type="email"
                autoComplete="email"
                optional={!guest}
                hint={guest ? "Your account login." : undefined}
                value={details.email}
                onValueChange={(v) => set("email", v)}
                error={errors.email}
                maxLength={120}
              />
              {guest && (
                <AuthField
                  ref={(el) => {
                    fieldRefs.current.password = el;
                  }}
                  label="Choose a password"
                  icon={KeyRound}
                  type="password"
                  autoComplete="new-password"
                  optional
                  hint="Leave empty and set one later with “Forgot password”."
                  value={details.password}
                  onValueChange={(v) => set("password", v)}
                  error={errors.password}
                  maxLength={100}
                  className="sm:col-span-2"
                />
              )}
            </div>
            {guest ? (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-mist px-3.5 py-3 text-[13px] leading-relaxed text-soft">
                <UserRound size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                <span>
                  When you order, we'll create a free Paradise account with these details so you can order faster next time. Already have one?{" "}
                  <Link to="/login?next=/checkout" className="font-semibold text-brand-dark underline-offset-2 hover:underline">
                    Log in
                  </Link>
                  .
                </span>
              </p>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-[13px] text-soft">
                <CircleCheck size={16} strokeWidth={2} aria-hidden="true" className="shrink-0 text-brand" />
                Ordering as <span className="font-semibold text-ink">{user?.email}</span>
              </p>
            )}
          </Panel>

          <Panel title="Collection or delivery" step={2}>
            <fieldset aria-describedby={errors.fulfilment ? fulfilmentErrorId : undefined}>
              <legend className="sr-only">Choose collection or delivery</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {fulfilments.map((f: Fulfilment, i) => {
                  const Icon = FULFILMENT_ICONS[f];
                  const checked = details.fulfilment === f;
                  return (
                    <label
                      key={f}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                        checked ? "border-brand bg-blush" : "border-line hover:border-ink/30"
                      }`}
                    >
                      <input
                        ref={
                          i === 0
                            ? (el) => {
                                fieldRefs.current.fulfilment = el;
                              }
                            : undefined
                        }
                        type="radio"
                        name="fulfilment"
                        value={f}
                        checked={checked}
                        onChange={() => set("fulfilment", f)}
                        className="mt-1 size-[18px] shrink-0 accent-[var(--color-brand)]"
                      />
                      <span className="flex-1">
                        <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                          <Icon size={18} strokeWidth={1.9} aria-hidden="true" className="text-brand" />
                          {ORDERING[f].label}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-muted">{ORDERING[f].note}</span>
                        <span className="mt-1 block text-[13px] font-medium text-soft">
                          {f === "collection"
                            ? "Free"
                            : ORDERING.delivery.freeFrom !== null && subtotal >= ORDERING.delivery.freeFrom
                              ? "Free delivery on this order"
                              : `${formatShortPrice(ORDERING.delivery.fee)} · min. order ${formatShortPrice(ORDERING.delivery.minimumOrder)}`}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.fulfilment && <FieldError id={fulfilmentErrorId}>{errors.fulfilment}</FieldError>}
            </fieldset>

            {delivery && (
              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px]">
                <AuthField
                  ref={(el) => {
                    fieldRefs.current.address = el;
                  }}
                  label="Delivery address"
                  icon={MapPin}
                  autoComplete="street-address"
                  placeholder="House number and street"
                  value={details.address}
                  onValueChange={(v) => set("address", v)}
                  error={errors.address}
                  maxLength={160}
                />
                <AuthField
                  ref={(el) => {
                    fieldRefs.current.postcode = el;
                  }}
                  label="Postcode"
                  icon={MapPin}
                  autoComplete="postal-code"
                  autoCapitalize="characters"
                  value={details.postcode}
                  onValueChange={(v) => set("postcode", v)}
                  error={errors.postcode}
                  maxLength={10}
                />
              </div>
            )}
          </Panel>

          <Panel title="Order notes" step={3}>
            <label htmlFor={notesId} className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-ink">
              Anything we should know?
              <span className="text-[12px] font-normal text-muted">Optional</span>
            </label>
            <textarea
              ref={(el) => {
                fieldRefs.current.notes = el;
              }}
              id={notesId}
              rows={3}
              maxLength={500}
              value={details.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Allergies, door buzzer, extra sauce…"
              aria-invalid={errors.notes ? true : undefined}
              className="w-full resize-y rounded-xl border border-line bg-white px-3.5 py-3 text-[14px] leading-relaxed text-ink placeholder:text-muted/80 transition-colors hover:border-ink/20 focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none"
            />
            <p className="mt-1.5 text-[12px] text-muted">
              Food allergies? Please tell us here and we'll call you to confirm before we cook.
            </p>
          </Panel>
        </div>

        <div className="lg:sticky lg:top-24">
          <OrderSummary totals={totals} fulfilment={details.fulfilment} itemCount={quantity}>
            <ul className="mt-4 max-h-64 divide-y divide-line overflow-y-auto border-t border-line">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <img src={menuImage(item.image)} alt="" width={44} height={44} className="size-11 shrink-0 rounded-lg border border-line bg-white object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">
                      {item.quantity} × {item.name}
                    </p>
                    {item.options && item.options.length > 0 && <p className="truncate text-[12px] text-muted">{item.options.join(" · ")}</p>}
                  </div>
                  <p className="text-[13px] font-semibold text-ink">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <Link to="/cart" className="mt-1 inline-flex min-h-9 items-center text-[13px] font-semibold text-brand-dark hover:text-ink">
              Edit cart
            </Link>

            {submitError && (
              <div className="mt-3">
                <FormAlert tone="error">{submitError}</FormAlert>
              </div>
            )}

            {cardPay && (
              <button type="submit" disabled={submitting} className={buttonClasses("primary", "md", "mt-4 h-12 w-full text-[15px] disabled:opacity-70")}>
                {submitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                    Taking you to secure payment…
                  </>
                ) : (
                  <>
                    <Lock size={17} strokeWidth={2.2} aria-hidden="true" />
                    Pay {formatPrice(totals.total)} securely
                  </>
                )}
              </button>
            )}
            {!cardPay && onlineOrderingConfigured && (
              <button type="submit" disabled={submitting} className={buttonClasses("primary", "md", "mt-4 w-full disabled:opacity-70")}>
                {submitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                    Placing order…
                  </>
                ) : (
                  <>Place order · {formatPrice(totals.total)}</>
                )}
              </button>
            )}
            {whatsappConfigured && (
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={submitting}
                className={buttonClasses(cardPay || onlineOrderingConfigured ? "outlineDark" : "primary", "md", "mt-2 w-full disabled:opacity-70")}
              >
                {submitting ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <WhatsAppIcon className="size-[18px]" />}
                {submitting ? "Preparing your order…" : cardPay ? "Or order on WhatsApp (pay later)" : "Send order on WhatsApp"}
              </button>
            )}
            {!canOrder && (
              <button type="button" disabled className={buttonClasses("primary", "md", "mt-4 w-full cursor-not-allowed opacity-50")}>
                Ordering not available yet
              </button>
            )}

            {cardPay ? (
              <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-relaxed text-muted">
                <Lock size={13} strokeWidth={2.2} aria-hidden="true" className="mt-0.5 shrink-0" />
                Card payments are processed securely by Stripe. We never see or store your card details.
              </p>
            ) : (
              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                No payment is taken on this website. You pay the restaurant directly, and they'll confirm the total and how to pay when they
                accept your order.
              </p>
            )}
          </OrderSummary>
        </div>
      </form>
    </main>
  );
}

function Panel({ title, step, children }: { title: string; step: number; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 md:p-6" aria-label={title}>
      <h2 className="mb-4 flex items-center gap-2.5 font-display text-[18px] font-bold text-ink">
        <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-full bg-ink text-[13px] text-white">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** One line on the confirmation screen about the customer's account. */
export function AccountNote({ account, email }: { account: Account; email: string }) {
  if (account === "existing" || account === "failed") return null;
  const text = {
    created: <>We've created your Paradise account ({email}) and logged you in, so next time is quicker.</>,
    "created-no-password": (
      <>
        We've created your Paradise account ({email}) and logged you in on this device. To log in elsewhere, set a password with{" "}
        <Link to="/forgot-password" className="font-semibold text-brand-dark underline-offset-2 hover:underline">
          Forgot password
        </Link>
        .
      </>
    ),
    "email-taken": (
      <>
        You already have an account with {email}.{" "}
        <Link to="/login" className="font-semibold text-brand-dark underline-offset-2 hover:underline">
          Log in
        </Link>{" "}
        next time to order faster.
      </>
    ),
  }[account];
  return <p className="rounded-lg bg-mist px-4 py-3 text-[14px] text-soft">{text}</p>;
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 text-[13px] font-medium text-brand-dark">
      <CircleAlert size={15} strokeWidth={2.2} aria-hidden="true" className="mt-px shrink-0" />
      {children}
    </p>
  );
}

export function Outcome({ icon, title, body, children }: { icon: React.ReactNode; title: string; body: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={`${container} py-14 md:py-20`}>
      <div className="mx-auto flex max-w-lg flex-col items-center text-center" role="status">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-blush text-brand">{icon}</span>
        <h2 className="mt-5 font-display text-[24px] leading-tight font-bold text-ink md:text-[28px]">{title}</h2>
        <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-muted">{body}</div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}
