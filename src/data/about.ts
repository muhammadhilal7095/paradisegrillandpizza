/**
 * About page content — editable brand messaging, not verified claims.
 */

export const STORY_PARAGRAPHS = [
  "BurgerBite started with a simple idea — to serve fresh, tasty and high-quality food that makes people happy. What began as a small dream has grown into a place where flavour, freshness and good moments come together.",
  "We focus on real ingredients, bold flavours and a great dining experience. Every burger, wrap, fry and drink is prepared with care, so you can enjoy food that always tastes amazing.",
];

export type ValueIcon = "leaf" | "chef" | "customers" | "heart";

export const VALUES: readonly { title: string; description: string; icon: ValueIcon }[] = [
  { title: "Fresh Ingredients", icon: "leaf", description: "We use high-quality ingredients to create fresh and flavourful meals." },
  { title: "Great Taste", icon: "chef", description: "Bold flavours and carefully prepared food, every time." },
  { title: "Happy Customers", icon: "customers", description: "Your happiness is at the heart of our approach." },
  { title: "Quality & Care", icon: "heart", description: "Prepared with care, served with love." },
];

export const COMMITMENT_TEXT =
  "We're committed to serving delicious food, maintaining high standards of quality and creating a friendly place where everyone can enjoy great meals. At BurgerBite, every meal is more than just food — it's a moment to enjoy.";

export const COLLAGE: readonly { caption: string; image: string; alt: string }[] = [
  { caption: "Fresh Ingredients", image: "/images/about-collage-ingredients.webp", alt: "Colourful fresh vegetables and herbs laid out on a table" },
  { caption: "Bold Flavours", image: "/images/about-collage-burger.webp", alt: "Stacked burger with bacon, cheese, lettuce and tomato" },
  { caption: "Tasty Moments", image: "/images/about-collage-moments.webp", alt: "Burger meal with fries and a dip" },
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
