/**
 * Terms and Conditions: for consumers in England & Wales (UK law). Not legal advice.
 *
 * Reflects: Consumer Rights Act 2015, Consumer Contracts Regulations 2013, Electronic Commerce
 * Regulations 2002, Food Information Regulations 2014. Liability for death or personal injury caused
 * by negligence, or for fraud, can never be excluded, so these terms don't try to.
 *
 * If the business is a limited company, add its registered name, company number and registered office
 * to "About Us" (and its VAT number if VAT-registered).
 */
import type { PolicyDocument } from "./policy";

export const TERMS: PolicyDocument = {
  meta: { status: "published", lastUpdated: "2026-10-16" },
  summary: [
    "Ordering means you accept these terms.",
    "Prices are in pounds sterling (GBP) and include VAT where it applies.",
    "Orders can't be cancelled or refunded once placed, except where the law requires.",
    "Tell us about any allergies before you order.",
  ],
  sections: [
    {
      id: "about-us",
      title: "About Us",
      icon: "user",
      content: [
        "This website is operated by Paradise Grill and Pizza, 121 Bath Rd, Slough SL1 3UW, United Kingdom. Email: info@paradisegap.co.uk. Phone: +44 1753 371730.",
        "These terms apply to every order placed through our website, by phone, by WhatsApp or in person. Please read them before ordering.",
      ],
    },
    {
      id: "using-our-website",
      title: "Using Our Website",
      icon: "globe",
      content: [
        "You may use our website to view our menu and place orders for personal use. You must not misuse the website, place false orders, or try to access parts of it you are not authorised to use. We try to keep the website available and accurate, but cannot guarantee it will always be uninterrupted or error-free.",
      ],
    },
    {
      id: "placing-an-order",
      title: "Placing an Order",
      icon: "bag",
      content: [
        "When you place an order, you are offering to buy the items in your basket. A contract between you and us is formed when we accept your order: for card payments, when your payment is confirmed; for WhatsApp or phone orders, when we confirm the order with you.",
        "We may decline an order, for example if an item is unavailable, we are closed, or your address is outside our delivery area. If we do, any payment taken will be refunded in full.",
      ],
    },
    {
      id: "prices-payment",
      title: "Prices and Payment",
      icon: "card",
      content: [
        "All prices are shown in pounds sterling (GBP) and include VAT where it applies. A service fee of £0.99 applies to every order. Delivery charges, the service fee and any minimum order value are all shown at checkout before you pay.",
        "Online card payments are processed securely by Stripe. Orders sent by WhatsApp are paid to the restaurant when you collect or receive them, as confirmed with you. If a price is shown incorrectly because of an obvious error, we will contact you before accepting the order.",
      ],
    },
    {
      id: "collection-delivery",
      title: "Collection and Delivery",
      icon: "truck",
      content: [
        "Collection and delivery times are estimates and may vary at busy times. For delivery, please make sure your address and phone number are correct and that someone is available to receive the order.",
        "If we cannot deliver because of an incorrect address or because nobody is available, we are not able to offer a refund.",
      ],
    },
    {
      id: "allergens",
      title: "Allergies and Food Information",
      icon: "alert",
      content: [
        "Our food is prepared in a kitchen that handles all 14 major allergens, including gluten, milk, eggs, nuts, peanuts, sesame, soya and fish. We cannot guarantee that any dish is completely free from allergens. If you have an allergy or intolerance, please tell us before ordering and ask us for allergen information, which we will provide as required by the Food Information Regulations 2014.",
      ],
    },
    {
      id: "cancellations-refunds",
      title: "Cancellations, Returns and Refunds",
      icon: "x",
      content: [
        "Our food is perishable and made to your order, so the 14-day cancellation right does not apply. Orders cannot be cancelled once placed and paid for, and we do not accept returns or give refunds for change of mind.",
        { text: "For full details of when a refund is given, please read our", link: { label: "Refund Policy", to: "/refund" } },
        { text: "For why food cannot be returned, please read our", link: { label: "Return Policy", to: "/return" } },
      ],
    },
    {
      id: "your-rights",
      title: "Your Statutory Rights",
      icon: "scale",
      content: [
        "Under the Consumer Rights Act 2015, the food we supply must be of satisfactory quality, as described and fit for purpose. If it is not, you are entitled to have it put right. Nothing in these terms affects your statutory rights.",
      ],
    },
    {
      id: "accounts",
      title: "Your Account",
      icon: "lock",
      content: [
        "If you create an account, or one is created for you when you order, please keep your password safe and tell us if you think someone else has used your account. You can ask us to delete your account at any time.",
      ],
    },
    {
      id: "liability",
      title: "Our Responsibility to You",
      icon: "shield",
      content: [
        "We are responsible for loss or damage you suffer that is a foreseeable result of us breaking these terms or failing to use reasonable care and skill. We are not responsible for loss that was not foreseeable, or for business losses, as our food is supplied for personal use only.",
        "Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else that cannot be limited by law.",
      ],
    },
    {
      id: "events-outside-control",
      title: "Events Outside Our Control",
      icon: "cloud",
      content: [
        "We are not responsible for delays or failure to supply caused by events outside our reasonable control, such as extreme weather, power failures or supplier problems. If this affects an order you have paid for, we will contact you and refund the order if it cannot be supplied.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Website Content",
      icon: "copyright",
      content: [
        "The text, logo, design and images on this website belong to us or our licensors and may not be copied or reused without permission. Some food photography is used under licence and may differ from the dish you receive.",
      ],
    },
    {
      id: "changes",
      title: "Changes to These Terms",
      icon: "refresh",
      content: [
        "We may update these terms from time to time. The terms that apply to your order are the ones shown on this page when you place it.",
      ],
    },
    {
      id: "law",
      title: "Governing Law",
      icon: "file",
      content: [
        "These terms are governed by the law of England and Wales, and any dispute will be dealt with by the courts of England and Wales. If you live in Scotland or Northern Ireland, you may also bring proceedings in your local courts.",
      ],
    },
  ],
};
