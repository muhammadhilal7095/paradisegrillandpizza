/**
 * About page content — editable brand messaging, not verified claims.
 */

export const STORY_PARAGRAPHS = [
  "Paradise Grill and Pizza started with a simple idea: cook the food we love to eat, properly, every single time. Fresh dough stretched by hand, chicken marinated overnight and grilled over the flame, curries simmered slowly with our own spice blends.",
  "Today we serve our neighbourhood stone-baked pizza, peri peri chicken, freshly carved kebabs, burgers and curries for collection and delivery. The menu has grown, but the rule hasn't changed: nothing is cooked until you order it.",
];

export type ValueIcon = "leaf" | "chef" | "customers" | "heart";

export const VALUES: readonly { title: string; description: string; icon: ValueIcon }[] = [
  { title: "Fresh Every Day", icon: "leaf", description: "Dough made daily and produce delivered fresh." },
  { title: "Cooked to Order", icon: "chef", description: "Nothing sits under a lamp. We start cooking when you order." },
  { title: "Happy Customers", icon: "customers", description: "Your happiness is at the heart of our approach." },
  { title: "Quality & Care", icon: "heart", description: "Prepared with care, served with love." },
];

export const COMMITMENT_TEXT =
  "We're committed to fresh ingredients, a spotless kitchen and food that tastes as good on the tenth order as on the first. Tell us about allergies or special requests and we'll do our best to help.";

export const COLLAGE: readonly { caption: string; image: string; alt: string }[] = [
  { caption: "Stone-Baked Pizza", image: "/images/menu/margherita-540.webp", alt: "Margherita pizza with fresh basil" },
  { caption: "Flame-Grilled Chicken", image: "/images/menu/peri-half-chicken-540.webp", alt: "Peri peri chicken grilled on a rack" },
  { caption: "Freshly Carved Kebabs", image: "/images/menu/lamb-doner-kebab-540.webp", alt: "Lamb doner kebab with salad" },
];

export type StatIcon = "customers" | "items" | "locations" | "rating";

/**
 * EXAMPLE FIGURES from the design reference — not confirmed business data.
 * Set STATS_CONFIRMED to true only once the business has verified every number.
 */
export const STATS: readonly { value: string; label: string; icon: StatIcon }[] = [
  { value: "10K+", label: "Happy Customers", icon: "customers" },
  { value: "50+", label: "Delicious Items", icon: "items" },
  { value: "3+", label: "Locations", icon: "locations" },
  { value: "4.8", label: "Customer Rating", icon: "rating" },
];

export const STATS_CONFIRMED = false;
