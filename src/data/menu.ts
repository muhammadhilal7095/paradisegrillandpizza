/**
 * Menu, category and offer data for the site.
 * Prices are SAMPLE values in pence — replace them with the restaurant's real pricing.
 */

export type CategoryId = "burgers" | "fries" | "chicken" | "wraps" | "drinks" | "desserts";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Price in pence. */
  price: number;
  category: CategoryId;
  image: string;
  imageAlt: string;
  bestSeller?: boolean;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  /** Prices in pence. */
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  imageAlt: string;
}

export const CATEGORIES: readonly Category[] = [
  { id: "burgers", name: "Burgers", description: "Juicy & Fresh", image: "/images/cat-burgers.webp", imageAlt: "Beef burger with cheese and lettuce" },
  { id: "fries", name: "Fries", description: "Crispy & Golden", image: "/images/cat-fries.webp", imageAlt: "Bowl of golden French fries" },
  { id: "chicken", name: "Chicken", description: "Tender & Delicious", image: "/images/cat-chicken.webp", imageAlt: "Crispy fried chicken drumsticks" },
  { id: "wraps", name: "Wraps", description: "Fresh & Healthy", image: "/images/cat-wraps.webp", imageAlt: "Grilled chicken wraps on a wooden board" },
  { id: "drinks", name: "Drinks", description: "Cool & Refreshing", image: "/images/cat-drinks.webp", imageAlt: "Glass of cola with ice" },
  { id: "desserts", name: "Desserts", description: "Sweet Endings", image: "/images/cat-desserts.webp", imageAlt: "Chocolate brownie topped with ice cream" },
];

export const PRODUCTS: readonly Product[] = [
  {
    id: "classic-burger",
    name: "Classic Burger",
    description: "Beef patty, lettuce, tomato, red onion, special sauce",
    price: 499,
    category: "burgers",
    image: "/images/product-classic-burger.webp",
    imageAlt: "Classic beef burger with lettuce, tomato and onion",
    bestSeller: true,
  },
  {
    id: "cheese-burger",
    name: "Cheese Burger",
    description: "Beef patty, melted cheese, lettuce, tomato, sauce",
    price: 549,
    category: "burgers",
    image: "/images/product-cheese-burger.webp",
    imageAlt: "Cheeseburger with melted cheese",
    bestSeller: true,
  },
  {
    id: "spicy-chicken-burger",
    name: "Spicy Chicken Burger",
    description: "Crispy chicken, lettuce, spicy mayo",
    price: 529,
    category: "burgers",
    image: "/images/product-spicy-chicken-burger.webp",
    imageAlt: "Crispy chicken burger with slaw and spicy mayo",
    bestSeller: true,
  },
  {
    id: "chicken-wrap",
    name: "Chicken Wrap",
    description: "Grilled chicken, fresh veggies, special sauce",
    price: 499,
    category: "wraps",
    image: "/images/product-chicken-wrap.webp",
    imageAlt: "Grilled chicken wrap cut in half",
    bestSeller: true,
  },
  {
    id: "crispy-chicken-wings",
    name: "Crispy Chicken Wings",
    description: "Hot & crispy, served with dip",
    price: 599,
    category: "chicken",
    image: "/images/product-chicken-wings.webp",
    imageAlt: "Glazed chicken wings with a dip",
    bestSeller: true,
  },
  {
    id: "chocolate-lava-cake",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with vanilla ice cream",
    price: 399,
    category: "desserts",
    image: "/images/product-lava-cake.webp",
    imageAlt: "Chocolate cake covered in melted chocolate",
    bestSeller: true,
  },
  {
    id: "golden-fries",
    name: "Golden Fries",
    description: "Crispy skin-on fries, lightly salted",
    price: 249,
    category: "fries",
    image: "/images/product-fries.webp",
    imageAlt: "Tray of golden French fries",
  },
  {
    id: "iced-cola",
    name: "Iced Cola",
    description: "Ice-cold cola served over ice",
    price: 179,
    category: "drinks",
    image: "/images/product-soft-drink.webp",
    imageAlt: "Glass of cola with ice cubes",
  },
];

export const BEST_SELLERS = PRODUCTS.filter((p) => p.bestSeller);

export const OFFERS: readonly Offer[] = [
  {
    id: "offer-classic-burger-meal",
    name: "Classic Burger Meal",
    description: "Burger + Fries + Drink",
    price: 699,
    originalPrice: 899,
    discountPercent: 20,
    image: "/images/offer-burger-meal.webp",
    imageAlt: "Burger served with fries and a dip",
  },
  {
    id: "offer-chicken-bucket",
    name: "Chicken Bucket",
    description: "6 pcs Chicken + Fries + Dip",
    price: 999,
    originalPrice: 1499,
    discountPercent: 30,
    image: "/images/offer-chicken-bucket.webp",
    imageAlt: "Bucket of crispy fried chicken pieces",
  },
  {
    id: "offer-chicken-wrap-combo",
    name: "Chicken Wrap Combo",
    description: "Wrap + Fries + Drink",
    price: 599,
    originalPrice: 699,
    discountPercent: 15,
    image: "/images/offer-wrap-combo.webp",
    imageAlt: "Chicken wrap filled with fries and onions",
  },
  {
    id: "offer-loaded-fries",
    name: "Loaded Fries",
    description: "Cheese + Bacon + Sauce",
    price: 499,
    originalPrice: 699,
    discountPercent: 25,
    image: "/images/offer-loaded-fries.webp",
    imageAlt: "Loaded fries topped with cheese and herbs",
  },
];

export const isCategoryId = (value: string | null): value is CategoryId =>
  CATEGORIES.some((c) => c.id === value);

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
export const formatPrice = (pence: number) => gbp.format(pence / 100);
