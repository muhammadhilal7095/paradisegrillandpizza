/**
 * Refund Policy: written for consumers in England & Wales (UK law). Not legal advice.
 *
 * Business position: all sales are final; no refunds for change of mind or cancellations. The
 * exceptions listed are the ones UK law requires and that cannot be excluded (Consumer Rights Act 2015
 * ss. 9–11, 19–24 and 31; Consumer Protection from Unfair Trading Regulations 2008, which make a
 * blanket "no refunds in any circumstances" notice misleading).
 */
import type { PolicyDocument } from "./policy";

export const REFUND_POLICY: PolicyDocument = {
  meta: { status: "published", lastUpdated: "2026-10-16" },
  summary: [
    "All sales are final: we do not give refunds for change of mind.",
    "Orders cannot be cancelled once placed and paid for.",
    "If we can't supply your order, you'll be refunded in full automatically.",
    "Wrong, missing or unsatisfactory items are put right as the law requires.",
  ],
  sections: [
    {
      id: "all-sales-final",
      title: "All Sales Are Final",
      icon: "ban",
      content: ["Because every order is freshly prepared as soon as it is placed, we do not offer refunds, credits or exchanges. This includes, for example:"],
      bullets: [
        "changing your mind, or no longer wanting the order;",
        "ordering the wrong item, size, extras or quantity;",
        "personal taste or preference;",
        "not being available to collect or receive the order at the agreed time or address;",
        "giving us an incorrect address or phone number.",
      ],
    },
    {
      id: "cancellations",
      title: "Cancelling an Order",
      icon: "x",
      content: [
        "We start preparing your food as soon as your order is placed and paid for, so orders cannot be cancelled or refunded after that point. Freshly prepared food is perishable and made to your order, so the 14-day cancellation period under the Consumer Contracts Regulations 2013 does not apply.",
      ],
    },
    {
      id: "when-we-refund",
      title: "When You Will Receive a Refund",
      icon: "wallet",
      content: ["We will refund you in the situations below, because UK law requires it:"],
      bullets: [
        "We cannot supply your order: for example we are closed, an item is unavailable, or we cannot deliver to your address. We will cancel the order and refund the full amount, including any delivery fee.",
        "Your order never arrives. If it is not delivered, contact us and we will either deliver it or refund you in full.",
        "Items are missing, incorrect or not of satisfactory quality (Consumer Rights Act 2015). We will normally put this right by preparing the correct item again. If that isn't possible, or doesn't fix the problem within a reasonable time, we will refund the affected items.",
        "You were charged the wrong amount. We will refund any overcharge.",
      ],
    },
    {
      id: "how-to-report",
      title: "How to Report a Problem",
      icon: "message",
      content: [
        "Contact us as soon as possible, ideally on the same day as your order, with your name, order details or payment reference, a description of the problem and, if you can, a photo. Please do not return the food to us.",
      ],
    },
    {
      id: "how-refunds-are-paid",
      title: "How Refunds Are Paid",
      icon: "card",
      content: [
        "Any refund is paid to the card or payment method used for the order. Card payments are processed by Stripe, and refunds usually appear on your statement within 5 to 10 working days, depending on your bank. Orders paid in person are refunded in the same way you paid.",
      ],
    },
    {
      id: "chargebacks",
      title: "Card Disputes",
      icon: "shield",
      content: [
        "If there is a problem with your order, please contact us first. We can usually resolve it quickly, which is faster for you than raising a dispute with your bank.",
      ],
    },
    {
      id: "statutory-rights",
      title: "Your Statutory Rights",
      icon: "scale",
      content: [
        "This policy does not affect your statutory rights as a consumer. For free, impartial advice, contact the Citizens Advice consumer helpline on 0808 223 1133 or visit citizensadvice.org.uk.",
      ],
    },
  ],
};
