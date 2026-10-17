/**
 * About page content: the restaurant's own brand messaging. Keep every statement true:
 * "Halal" reflects the restaurant's logo; check FAQ answers whenever how you work changes.
 */

export const STORY_PARAGRAPHS = [
  "Paradise Grill and Pizza started with a simple idea: cook the food we love to eat, properly, every single time. Dough is stretched by hand, chicken is marinated and grilled over the flame, and our curries are simmered slowly with our own spice blends.",
  "From our kitchen on Bath Road in Slough, we serve stone-baked pizza, peri peri chicken, freshly carved kebabs, burgers, curries and sides, for collection or delivery.",
  "The menu has grown, but one rule hasn't changed: nothing is cooked until you order it. That's why our food reaches you hot, fresh and full of flavour.",
];

/** "What we serve" tiles. Images are square photos in /public/images/menu. */
export const SERVE = [
  { title: "Stone-Baked Pizza", text: "Hand-stretched bases, rich tomato sauce and plenty of mozzarella.", image: "margherita", alt: "Margherita pizza with fresh basil" },
  { title: "Peri Peri Chicken", text: "Marinated and flame-grilled, from mild to extra hot.", image: "peri-half-chicken", alt: "Peri peri chicken grilled on a rack" },
  { title: "Kebabs & Wraps", text: "Freshly carved doner and shawarma with salad and sauces.", image: "lamb-doner-kebab", alt: "Lamb doner kebab with salad" },
  { title: "Curries", text: "Slow-cooked with our own spice blends, served with rice or naan.", image: "chicken-tikka-masala", alt: "Bowl of chicken tikka masala" },
  { title: "Burgers", text: "Juicy beef and crispy chicken burgers, stacked high.", image: "classic-burger", alt: "Beef burger with lettuce and tomato" },
  { title: "Sides & Extras", text: "Fries, garlic bread, wings and more to share.", image: "loaded-fries", alt: "Loaded fries topped with cheese" },
] as const;

export type ValueIcon = "leaf" | "chef" | "halal" | "allergy" | "clean" | "price";

export const VALUES: readonly { title: string; description: string; icon: ValueIcon }[] = [
  { title: "Fresh Every Day", icon: "leaf", description: "Dough made daily and fresh ingredients prepared in our own kitchen." },
  { title: "Cooked to Order", icon: "chef", description: "Nothing waits under a lamp. We start cooking the moment you order." },
  { title: "Halal Food", icon: "halal", description: "We serve halal food, as shown on our logo. Ask us if you'd like details about a dish." },
  { title: "Allergy Care", icon: "allergy", description: "Tell us about allergies before you order and we'll talk you through the options." },
  { title: "Clean Kitchen", icon: "clean", description: "High standards of food hygiene and safety, every day." },
  { title: "Fair Prices", icon: "price", description: "Generous portions and meal deals that are good value for everyone." },
];

export const PROCESS_STEPS = [
  { title: "Order your way", text: "Order online with secure card payment, or call us." },
  { title: "Freshly prepared", text: "Our chefs cook your order from scratch the moment it arrives." },
  { title: "Collect or delivery", text: "Pick it up hot from Bath Road, or have it delivered to your door." },
];

export const FAQS = [
  {
    q: "Where are you located?",
    a: "Our kitchen is at 121 Bath Rd, Slough SL1 3UW. Use the directions link above to find us.",
  },
  {
    q: "Do you deliver?",
    a: "Yes, we deliver to nearby areas of Slough. A delivery fee and minimum order apply, both shown at checkout. If you're not sure we cover your address, give us a call.",
  },
  {
    q: "Is your food halal?",
    a: "Yes. As shown on our logo, we serve halal food. If you'd like details about a particular dish, just ask us.",
  },
  {
    q: "I have a food allergy. Can I still order?",
    a: "Please tell us about any allergy or intolerance before you order. Our kitchen handles all 14 major allergens, so we can't guarantee any dish is completely allergen-free, but we're happy to help you choose.",
  },
  {
    q: "How can I pay?",
    a: "You can pay securely online by card when you order through our website. Card payments are processed by Stripe; we never see or store your card details.",
  },
  {
    q: "Can I cancel or change my order?",
    a: "We start cooking straight away, so orders can't be cancelled or refunded once placed. If something is wrong with your order, contact us and we'll put it right. See our Refund Policy for details.",
  },
];
