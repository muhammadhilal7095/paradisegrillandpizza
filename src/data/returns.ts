/**
 * Returns & Refunds content — EDITABLE DRAFT, not legal advice.
 * The business must approve every clause and check it against applicable consumer-protection
 * and food-safety law before setting RETURNS_META.status to "published".
 *
 * Deliberately NOT stated (confirm before adding): a request deadline, refund processing times,
 * any fees. Nothing here may remove customers' statutory rights.
 */
import type { PolicyMeta, PolicySection } from "./policy";

export const RETURNS_META: PolicyMeta & {
  /** e.g. "24 hours of receiving your order". Leave null until the business confirms a window. */
  requestWindow: string | null;
} = {
  status: "draft",
  lastUpdated: null,
  requestWindow: null,
};

export type ReturnsIcon = "utensils" | "clipboard" | "ban" | "wallet" | "refresh" | "truck" | "x" | "message";

export type ReturnsSection = PolicySection<ReturnsIcon>;

const contactPromptly = RETURNS_META.requestWindow
  ? `please contact our support team within ${RETURNS_META.requestWindow}`
  : "please contact our support team promptly";

/** Order here is the order on the page; numbers (01–08) are derived from it. */
export const RETURNS_SECTIONS: readonly ReturnsSection[] = [
  {
    id: "what-can-be-returned",
    title: "What Can Be Returned",
    icon: "utensils",
    content: [
      "We accept requests for refunds or replacements for incorrect items, damaged items, or meals that do not meet our published food-quality standards.",
      "Each request is reviewed according to the circumstances and applicable consumer-protection requirements.",
    ],
  },
  {
    id: "eligibility-for-return",
    title: "Eligibility for Return",
    icon: "clipboard",
    content: [
      `To request a return, refund, or replacement, ${contactPromptly} and provide your order reference, a description of the issue, and any relevant supporting information.`,
      "We will review the request and explain the available options.",
    ],
  },
  {
    id: "non-returnable-items",
    title: "Non-Returnable Items",
    icon: "ban",
    content: [
      "For food-safety reasons, we generally cannot accept ordinary physical returns of prepared food after delivery or collection.",
      "However, you can still contact us about incorrect orders, quality concerns, food-safety issues, or other problems requiring review. Nothing in this policy affects your rights under applicable law.",
    ],
  },
  {
    id: "refund-process",
    title: "Refund Process",
    icon: "wallet",
    content: [
      "Once a refund request has been reviewed and approved, any refund will be processed through the applicable payment method or another agreed method, subject to the payment provider's processing arrangements.",
      "We will communicate the outcome and any relevant next steps.",
    ],
  },
  {
    id: "replacement",
    title: "Replacement",
    icon: "refresh",
    content: [
      "Where appropriate, we may offer a replacement for an incorrect, missing, damaged, or unsatisfactory item.",
      "Replacement options depend on the issue, product availability, and applicable consumer rights. We will explain the available resolution options during the review.",
    ],
  },
  {
    id: "delivery-issues",
    title: "Delivery Issues",
    icon: "truck",
    content: [
      "If your order arrives incomplete, incorrect, or in an unsuitable condition, please contact our support team and provide your order reference and a description of the issue.",
      "Where helpful and appropriate, you may provide photographs to assist our review. We will assess the circumstances and explain the available next steps.",
    ],
  },
  {
    id: "change-of-mind",
    title: "No Refund for Change of Mind",
    icon: "x",
    content: [
      "A change of preference after an order has been prepared or supplied may not, by itself, qualify for a refund under our standard policy.",
      "This does not affect any mandatory consumer rights or remedies that apply to your circumstances.",
    ],
  },
  {
    id: "need-help",
    title: "Need Help?",
    icon: "message",
    content: [
      "If you have questions about returns, refunds, replacements, or an existing order, please contact our support team.",
      "We will review the information you provide and explain the next steps.",
    ],
    showContactDetails: true,
  },
];

/** "How to Request a Return" — the general support workflow. Photos are optional. */
export const RETURN_STEPS = [
  "Contact our support team.",
  "Share your order details.",
  "Provide clear photos if applicable.",
  "We will review and process your request.",
];
