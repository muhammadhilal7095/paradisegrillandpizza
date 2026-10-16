/**
 * Privacy Policy content — EDITABLE DRAFT, not legal advice.
 * It describes what this website actually does today. The business owner must review it
 * (UK GDPR / Data Protection Act 2018) and add their legal name, address and ICO details
 * before setting PRIVACY_META.status to "published". Update it whenever a payment provider,
 * analytics or a new ordering system is added.
 */

import type { PolicyMeta, PolicySection } from "./policy";

export const PRIVACY_META: PolicyMeta = {
  status: "draft",
  lastUpdated: null,
};

export type PrivacyIcon = "user" | "cart" | "message" | "lock" | "globe" | "clock" | "scale" | "mail";

export const PRIVACY_SECTIONS: readonly PolicySection<PrivacyIcon>[] = [
  {
    id: "who-we-are",
    title: "Who We Are",
    icon: "user",
    content: [
      "Paradise Grill and Pizza is responsible for the personal information collected through this website. This policy explains what we collect, why, and the choices you have.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    icon: "cart",
    content: [
      "When you order, we ask for your name, phone number, optional email address, your delivery address and postcode (for delivery orders) and any notes you add, such as allergy information.",
      "If you create an account, we store your name, email address and phone number. If you send us a message through the Contact page, we receive your name, email address and message.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How We Use It",
    icon: "message",
    content: [
      "We use your details only to prepare, deliver or hand over your order, to contact you about it, to answer your messages and to manage your account. We do not sell your information or use it for marketing without your permission.",
    ],
  },
  {
    id: "whatsapp-orders",
    title: "WhatsApp Orders",
    icon: "message",
    content: [
      "If you choose to send your order by WhatsApp, the website prepares a message with your order and details, and you send it from your own WhatsApp account. That message is then handled under WhatsApp's own privacy policy as well as ours.",
    ],
  },
  {
    id: "stored-on-your-device",
    title: "Stored on Your Device",
    icon: "lock",
    content: [
      "Your cart is saved in your browser's local storage so it's still there when you come back. If you log in, a sign-in token is stored the same way. We don't use advertising or analytics cookies. You can clear this data at any time from your browser settings.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-Party Services",
    icon: "globe",
    content: [
      "This website loads its fonts from Google Fonts, which means your browser connects to Google's servers.",
      "Online card payments are handled by Stripe on its secure payment page. Your card details go directly to Stripe and are never seen or stored by us. We share your name, contact details and order with Stripe so the payment and receipt match your order. Stripe's own privacy policy applies to the payment.",
    ],
  },
  {
    id: "how-long-we-keep-it",
    title: "How Long We Keep It",
    icon: "clock",
    content: [
      "We keep order details only as long as needed to complete the order, deal with any questions or refunds, and meet our legal and accounting obligations.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    icon: "scale",
    content: [
      "You can ask to see the personal information we hold about you, ask us to correct or delete it, or object to how we use it. You also have the right to complain to the Information Commissioner's Office (ICO).",
    ],
  },
  {
    id: "contact-privacy",
    title: "Contact Us",
    icon: "mail",
    content: ["For any privacy question or request, please get in touch using the details below."],
    showContactDetails: true,
  },
];
