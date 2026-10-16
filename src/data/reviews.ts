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

export const REVIEW_SUMMARY = { average: 4.8, count: "2,500+" };

export const REVIEWS: readonly Review[] = [
  { id: "sarah", name: "Sarah Khan", rating: 5, text: "Amazing food! The burger was fresh, juicy and full of flavor. Definitely ordering again!" },
  { id: "ali", name: "Ali Raza", rating: 5, text: "Best chicken wings in town. Great quality and fast delivery." },
  { id: "ayesha", name: "Ayesha Malik", rating: 5, text: "Hot, fresh and delicious. BurgerBite never disappoints!" },
  { id: "james", name: "James Carter", rating: 5, text: "The loaded fries are unreal. Generous portions and friendly staff." },
  { id: "emma", name: "Emma Wilson", rating: 4, text: "Lovely wraps and the lava cake is a must. Arrived warm and on time." },
  { id: "omar", name: "Omar Farooq", rating: 5, text: "Great value meal deals. My whole family loved the chicken bucket." },
];
