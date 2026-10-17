/**
 * Privacy Policy: UK GDPR, Data Protection Act 2018 and PECR. Not legal advice.
 * It describes what this website actually does. Update it when a new service is added
 * (analytics, marketing emails, a new ordering system or delivery partner).
 *
 * Check with the business: whether it is registered with the ICO (most food businesses processing
 * customer data must pay the data protection fee: ico.org.uk/fee) and its legal entity name.
 */
import type { PolicyDocument } from "./policy";

export const PRIVACY_POLICY: PolicyDocument = {
  meta: { status: "published", lastUpdated: "2026-10-16" },
  summary: [
    "We only collect what we need to take, prepare and deliver your order.",
    "We never sell your data or send marketing without your consent.",
    "Card details go straight to Stripe. We never see or store them.",
    "You can ask to see, correct or delete your data at any time.",
  ],
  sections: [
    {
      id: "who-we-are",
      title: "Who We Are",
      icon: "user",
      content: [
        "Paradise Grill and Pizza, 121 Bath Rd, Slough SL1 3UW, United Kingdom (\"we\", \"us\") is the data controller for personal information collected through this website and when you order from us. You can contact us at info@paradisegap.co.uk or +44 1753 371730.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      icon: "clipboard",
      content: ["We collect the following information when you use our website or order from us:"],
      bullets: [
        "Order details: your name, phone number, email address, delivery address and postcode, what you ordered and any notes you add.",
        "Allergy or dietary information you choose to tell us, used only to prepare your food safely.",
        "Account details if you create an account: name, email, phone number and a securely stored password.",
        "Messages you send us through the Contact page, email, phone or WhatsApp.",
        "Payment details: card payments are handled by Stripe. We receive confirmation of the payment, but never your full card number.",
        "Basic technical information, such as your IP address and browser type, recorded by our hosting provider for security.",
      ],
    },
    {
      id: "how-we-use-it",
      title: "How We Use Your Information and Our Lawful Basis",
      icon: "scale",
      content: ["Under the UK GDPR we must have a lawful basis for using your information. We use it:"],
      bullets: [
        "to take, prepare, deliver and take payment for your order, and to contact you about it (performance of a contract);",
        "to manage your account and answer your questions (performance of a contract, or our legitimate interests in providing good customer service);",
        "to handle allergy information you give us (your explicit consent, which you can withdraw at any time);",
        "to keep financial and tax records (legal obligation);",
        "to keep our website secure and prevent fraud (legitimate interests).",
      ],
    },
    {
      id: "marketing",
      title: "Marketing",
      icon: "mail",
      content: [
        "We do not send marketing messages unless you have clearly agreed to receive them. If you do agree, you can unsubscribe at any time, and we follow the Privacy and Electronic Communications Regulations (PECR).",
      ],
    },
    {
      id: "sharing",
      title: "Who We Share It With",
      icon: "share",
      content: ["We never sell your personal information. We only share it with trusted providers who help us run our service, and only as much as they need:"],
      bullets: [
        "Stripe, to process card payments securely;",
        "our restaurant ordering and point-of-sale system, to manage orders and accounts;",
        "WhatsApp (Meta), if you choose to send or receive order messages by WhatsApp;",
        "our website hosting provider, and Google Fonts, which provides the website's fonts;",
        "our delivery staff, who receive your name, address and phone number to deliver your order;",
        "authorities such as HMRC or the police, where the law requires it.",
      ],
    },
    {
      id: "international-transfers",
      title: "International Transfers",
      icon: "globe",
      content: [
        "Some providers, such as Stripe, Meta and Google, may process information outside the UK. Where they do, the transfer is protected by UK adequacy regulations or approved safeguards such as the International Data Transfer Agreement.",
      ],
    },
    {
      id: "retention",
      title: "How Long We Keep It",
      icon: "clock",
      content: ["We keep personal information only for as long as we need it:"],
      bullets: [
        "order and payment records: 6 years, as required for tax and accounting purposes;",
        "your account: until you ask us to delete it;",
        "messages and enquiries: up to 12 months after they are resolved;",
        "allergy notes on an order: only as long as the order record is kept.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Storage on Your Device",
      icon: "cookie",
      content: [
        "We do not use advertising or tracking cookies. Our website stores only what is strictly necessary in your browser's local storage: your basket, so it isn't lost when you come back, and a sign-in token if you log in. Because this storage is strictly necessary, no cookie consent is required, and you can clear it at any time in your browser settings.",
      ],
    },
    {
      id: "security",
      title: "Keeping Your Information Safe",
      icon: "lock",
      content: [
        "Our website uses an encrypted (HTTPS) connection, passwords are never stored in readable form, and access to customer information is limited to the people who need it to serve you.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: "shield",
      content: ["Under the UK GDPR you have the right to:"],
      bullets: [
        "access the personal information we hold about you;",
        "ask us to correct information that is wrong or incomplete;",
        "ask us to delete your information (unless we must keep it by law);",
        "ask us to restrict or stop using your information, or object to how we use it;",
        "receive your information in a portable format;",
        "withdraw your consent at any time, where we rely on consent.",
      ],
    },
    {
      id: "exercise-rights",
      title: "How to Use Your Rights",
      icon: "message",
      content: [
        "Contact us using the details below. There is normally no fee, and we will reply within one month. We may need to confirm your identity before we act on a request.",
      ],
    },
    {
      id: "children",
      title: "Children",
      icon: "user",
      content: ["Our website is not intended for children under 13, and we do not knowingly collect their personal information."],
    },
    {
      id: "complaints",
      title: "Complaints",
      icon: "alert",
      content: [
        "If you are unhappy with how we have used your information, please contact us first so we can try to put it right. You also have the right to complain to the Information Commissioner's Office (ICO): ico.org.uk/make-a-complaint, or call 0303 123 1113.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      icon: "file",
      content: ["We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated."],
    },
  ],
};
