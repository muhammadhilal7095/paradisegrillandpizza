/**
 * Terms & Conditions content — EDITABLE DRAFT, not legal advice.
 * The business owner must review every clause for the jurisdiction it operates in
 * before setting TERMS_META.status to "published".
 *
 * Things deliberately left for the business to confirm (do not invent them):
 *  - the order modification/cancellation window (section 04),
 *  - payment methods, fees and delivery charges (sections 03, 05),
 *  - the effective date (lastUpdated).
 */

export const TERMS_META = {
  status: "draft" as "draft" | "published",
  /** ISO date (YYYY-MM-DD) of the version on this page. Leave null until it is real. */
  lastUpdated: null as string | null,
  currency: "GBP (£)",
};

export type TermsIcon =
  | "file"
  | "bag"
  | "card"
  | "clipboard"
  | "truck"
  | "star"
  | "users"
  | "shield"
  | "copyright"
  | "scale"
  | "mail";

/** A paragraph, optionally ending with an internal link. */
export type TermsParagraph = string | { text: string; link: { label: string; to: string } };

export interface TermsSection {
  id: string;
  title: string;
  icon: TermsIcon;
  content: TermsParagraph[];
  /** Renders the configured email/phone under the text. */
  showContactDetails?: boolean;
}

/** Order here is the order on the page; numbers (01–11) are derived from it. */
export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    id: "general-information",
    title: "General Information",
    icon: "file",
    content: [
      "These terms and conditions apply to all orders, website visits, and interactions with BurgerBite. By using our website or placing an order, you agree to follow these terms.",
    ],
  },
  {
    id: "orders-availability",
    title: "Orders & Availability",
    icon: "bag",
    content: [
      "All orders are subject to availability. We reserve the right to correct or refuse an order where necessary, in accordance with applicable law and our published ordering policies.",
    ],
  },
  {
    id: "pricing-payment",
    title: "Pricing & Payment",
    icon: "card",
    content: [
      `All prices are displayed in ${TERMS_META.currency} and include applicable taxes where required. Prices may change without notice. We display available payment methods during checkout and use secure payment processing where supported.`,
    ],
  },
  {
    id: "order-modification-cancellation",
    title: "Order Modification & Cancellation",
    icon: "clipboard",
    content: [
      "Orders can be modified or cancelled within a stated period after placement, where permitted by our operational policies and applicable law. Once preparation has started, cancellation or modification may not be possible.",
      { text: "For urgent changes to an order, please get in touch as soon as possible.", link: { label: "Contact us", to: "/contact" } },
    ],
  },
  {
    id: "delivery-pickup",
    title: "Delivery & Pickup",
    icon: "truck",
    content: [
      "We aim to deliver your order on time or prepare it for collection within the displayed time estimate. Delivery times may vary because of demand, traffic, weather, and other circumstances.",
    ],
  },
  {
    id: "food-quality",
    title: "Food Quality",
    icon: "star",
    content: [
      "We aim to serve freshly prepared food using ingredients selected according to our food preparation standards. If you experience an issue with your order, please contact us promptly so we can review the matter.",
      { text: "If you have an allergy or dietary requirement, please speak to us before ordering.", link: { label: "Contact us", to: "/contact" } },
    ],
  },
  {
    id: "customer-responsibilities",
    title: "Customer Responsibilities",
    icon: "users",
    content: [
      "Please provide accurate contact and delivery information when placing an order. Customers should use the website respectfully and avoid unauthorized activity.",
      "Please review your order details before confirming a purchase.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    icon: "shield",
    content: [
      "BurgerBite aims to provide reliable website and ordering services. Any limitations of liability must be interpreted in accordance with applicable law and must not exclude rights or responsibilities that cannot legally be excluded.",
    ],
  },
  {
    id: "content-branding",
    title: "Content & Branding",
    icon: "copyright",
    content: [
      "Website text, branding, logos, photographs, graphics, and other materials may be protected by intellectual-property laws.",
      "You may not reproduce or distribute protected materials without appropriate permission, except where permitted by law.",
    ],
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms",
    icon: "scale",
    content: [
      "We may update these terms when our services, business operations, or legal requirements change. The latest version will be published on this page, together with the applicable effective date.",
      "Where required, we will provide notice of significant changes.",
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    icon: "mail",
    content: [
      "If you have questions about these terms and conditions, please contact our customer-support team using the contact details provided on our Contact page.",
    ],
    showContactDetails: true,
  },
];

/** Supporting brand message beside the last card — not part of the terms themselves. */
export const BRAND_RULES = ["Fresh Food", "Fair Policies", "Safe & Secure Orders", "Better Experience", "Happy Customers"];

export const sectionNumber = (index: number) => String(index + 1).padStart(2, "0");
