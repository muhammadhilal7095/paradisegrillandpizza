/**
 * Customer reviews shown on the homepage.
 * PLACEHOLDER CONTENT: replace with real, attributable customer reviews before launch.
 */
export interface Review {
  id: string;
  name: string;
  /** Whole stars, 1–5. */
  rating: number;
  text: string;
}

/**
 * False while the reviews below are samples. The section then shows a "sample reviews" note and
 * hides the rating summary, so visitors aren't shown made-up figures. Set true once every review
 * (and the summary) comes from real customers.
 */
export const REVIEWS_VERIFIED = false;

export const REVIEW_SUMMARY = { average: 4.8, count: "2,500+" };

export const REVIEWS: readonly Review[] = [
  { id: "sarah", name: "Sarah Khan", rating: 5, text: "The pepperoni pizza was spot on: thin, crispy base and loads of cheese. Arrived piping hot." },
  { id: "ali", name: "Ali Raza", rating: 5, text: "Best peri peri chicken around. The Extra Hot really is extra hot!" },
  { id: "ayesha", name: "Ayesha Malik", rating: 5, text: "Ordered on WhatsApp, they confirmed in minutes and the food was lovely." },
  { id: "james", name: "James Carter", rating: 5, text: "Massive doner kebab, fresh salad and the garlic sauce is the real deal." },
  { id: "emma", name: "Emma Wilson", rating: 4, text: "The chicken tikka masala and garlic naan were delicious. Will order again." },
  { id: "omar", name: "Omar Farooq", rating: 5, text: "The Family Feast fed all five of us. Great value for a Friday night." },
];
