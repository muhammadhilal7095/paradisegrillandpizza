/**
 * Return Policy: written for consumers in England & Wales (UK law). Not legal advice.
 *
 * Business position: we do not accept returns. That is lawful for freshly prepared food, which is
 * perishable and made to order (Consumer Contracts Regulations 2013, reg. 28(1)(b) and (d)). What the
 * law does NOT allow is removing customers' rights under the Consumer Rights Act 2015 when an order is
 * wrong, missing or not of satisfactory quality, so those remedies are stated plainly below.
 *
 * If the business trades as a limited company, add its registered name, company number and registered
 * office to the "About us" section of terms.ts (Companies Act 2006 / E-Commerce Regulations 2002).
 */
import type { PolicyDocument } from "./policy";

export const RETURN_POLICY: PolicyDocument = {
  meta: { status: "published", lastUpdated: "2026-10-16" },
  summary: [
    "We do not accept returns of food or drink.",
    "Food is perishable and made to order, so the 14-day cancellation right does not apply.",
    "If your order is wrong, missing items or not of satisfactory quality, tell us and we'll put it right.",
    "Your statutory rights are not affected.",
  ],
  sections: [
    {
      id: "no-returns",
      title: "We Do Not Accept Returns",
      icon: "ban",
      content: [
        "Paradise Grill and Pizza sells freshly prepared hot food and drinks. Once an order has been collected or delivered, we cannot accept any of it back, and we do not exchange or take back items because you have changed your mind, ordered the wrong item or no longer want it.",
      ],
    },
    {
      id: "why",
      title: "Why Food Cannot Be Returned",
      icon: "utensils",
      content: [
        "Every order is cooked fresh when you place it, so it is made to your request and is perishable. Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, the usual 14-day right to cancel an online order does not apply to goods that are perishable or made to the customer's specification.",
        "For food safety and hygiene reasons (Food Safety Act 1990), food that has left our premises can never be taken back, re-sold or re-served.",
      ],
    },
    {
      id: "check-your-order",
      title: "Please Check Your Order",
      icon: "clipboard",
      content: ["Please check your order as soon as you collect it or it is delivered, so that any problem can be sorted out straight away."],
      bullets: [
        "Check that every item and any extras you chose are included.",
        "Check that the order is the one you placed and is in a suitable condition.",
        "If something isn't right, contact us as soon as possible, ideally on the same day.",
      ],
    },
    {
      id: "if-something-is-wrong",
      title: "If Something Is Wrong With Your Order",
      icon: "refresh",
      content: [
        "Under the Consumer Rights Act 2015, the food we supply must be of satisfactory quality, as described and fit for purpose. If your order is incorrect, has missing items, or is not of satisfactory quality, please contact us with your order details and, if you can, a photo. You do not need to bring or send the food back.",
        "Where the law requires it, we will put things right, usually by preparing the correct or missing item again. See our Refund Policy for the rare cases where money is returned.",
        { text: "Read how we handle these cases in our", link: { label: "Refund Policy", to: "/refund" } },
      ],
    },
    {
      id: "allergies",
      title: "Allergies and Dietary Requirements",
      icon: "alert",
      content: [
        "If you have a food allergy or intolerance, please tell us before you order and ask us about the 14 allergens. We cannot take back or replace food because of an allergen or dietary need that was not mentioned when ordering. If you believe you were given incorrect allergen information, please contact us immediately.",
      ],
    },
    {
      id: "statutory-rights",
      title: "Your Statutory Rights",
      icon: "scale",
      content: [
        "Nothing in this policy affects your statutory rights as a consumer. For free, impartial advice about your rights, contact the Citizens Advice consumer helpline on 0808 223 1133 or visit citizensadvice.org.uk.",
      ],
    },
  ],
};
