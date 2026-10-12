/**
 * Single source of truth for menu, category, section and offer data.
 * Prices are SAMPLE values in pence — replace them with the restaurant's real pricing.
 * Products can be marked `available: false` to hide them without deleting them.
 */

export type CategoryId = "burgers" | "chicken" | "wraps" | "pizza" | "sides" | "drinks" | "desserts" | "combos";

export interface Product {
  id: string;
  name: string;
  description?: string;
  /** Price in pence. */
  price: number;
  category: CategoryId;
  /** Extra categories the product is also listed under (e.g. a chicken wrap under Chicken). */
  alsoIn?: CategoryId[];
  image: string;
  imageAlt: string;
  bestSeller?: boolean;
  available?: boolean;
}

/** Order and copy for the category strip and menu sections. */
export interface MenuCategory {
  id: CategoryId;
  name: string;
  /** Shown under the section heading. */
  tagline: string;
  /** Products shown on the full menu, in order. "View All" shows every product in the category. */
  featured: string[];
  /** Sides, drinks and desserts use the smaller card. */
  compact?: boolean;
}

export const MENU_CATEGORIES: readonly MenuCategory[] = [
  { id: "burgers", name: "Burgers", tagline: "Juicy, fresh and full of flavour.", featured: ["classic-burger", "cheese-burger", "bbq-burger", "spicy-burger"] },
  { id: "chicken", name: "Chicken", tagline: "Crispy, tender and always a good idea.", featured: ["chicken-burger", "chicken-wrap", "hot-chicken-burger", "chicken-wings"] },
  { id: "wraps", name: "Wraps", tagline: "Fresh, light and full of flavour.", featured: ["chicken-wrap", "bbq-chicken-wrap", "spicy-chicken-wrap", "veggie-wrap"] },
  // No pizzas yet — add products with category "pizza" and they appear automatically.
  { id: "pizza", name: "Pizza", tagline: "Stone-baked favourites.", featured: [] },
  { id: "sides", name: "Sides", tagline: "Perfect sides for your meal.", featured: ["french-fries", "loaded-fries", "onion-rings", "mozzarella-sticks"], compact: true },
  { id: "drinks", name: "Drinks", tagline: "Cool sips for hot cravings.", featured: ["coke", "diet-coke", "fanta", "sprite"], compact: true },
  { id: "desserts", name: "Desserts", tagline: "Sweet endings.", featured: ["chocolate-cake", "ice-cream", "cheesecake", "brownie"], compact: true },
  { id: "combos", name: "Combos", tagline: "Meals made for sharing — or not.", featured: ["classic-burger-meal", "chicken-bucket", "chicken-wrap-combo"] },
];

const img = (name: string) => `/images/product-${name}.webp`;

export const PRODUCTS: readonly Product[] = [
  // Burgers
  { id: "classic-burger", name: "Classic Burger", description: "Beef patty, lettuce, tomato, red onion and special sauce.", price: 699, category: "burgers", image: img("classic-burger"), imageAlt: "Classic beef burger with lettuce, tomato and onion", bestSeller: true },
  { id: "cheese-burger", name: "Cheese Burger", description: "Beef patty, melted cheese, lettuce, tomato and sauce.", price: 749, category: "burgers", image: img("cheese-burger"), imageAlt: "Double cheeseburger with melted cheese", bestSeller: true },
  { id: "bbq-burger", name: "BBQ Burger", description: "Beef patty, bacon, cheese, lettuce, onion and BBQ sauce.", price: 849, category: "burgers", image: img("bbq-burger"), imageAlt: "Stacked beef burger with bacon and cheese" },
  { id: "spicy-burger", name: "Spicy Burger", description: "Beef patty, jalapeños, lettuce, tomato and spicy sauce.", price: 799, category: "burgers", image: img("spicy-burger"), imageAlt: "Beef burger with lettuce and tomato on a dark board" },
  // Chicken
  { id: "chicken-burger", name: "Chicken Burger", description: "Crispy chicken, lettuce, mayo and fresh veggies.", price: 699, category: "chicken", image: img("chicken-burger"), imageAlt: "Crispy chicken burger with lettuce" },
  { id: "hot-chicken-burger", name: "Hot Chicken Burger", description: "Spicy chicken, lettuce, tomato and chilli sauce.", price: 749, category: "chicken", image: img("hot-chicken-burger"), imageAlt: "Crispy spicy chicken burger" },
  { id: "spicy-chicken-burger", name: "Spicy Chicken Burger", description: "Crispy chicken, lettuce and spicy mayo.", price: 529, category: "chicken", image: img("spicy-chicken-burger"), imageAlt: "Crispy chicken burger with slaw and spicy mayo", bestSeller: true },
  { id: "chicken-wings", name: "Chicken Wings (6 pcs)", description: "Crispy wings served with your choice of sauce.", price: 599, category: "chicken", image: img("chicken-wings"), imageAlt: "Glazed chicken wings with a dip", bestSeller: true },
  // Wraps
  { id: "chicken-wrap", name: "Chicken Wrap", description: "Grilled chicken, lettuce, fresh vegetables and special sauce.", price: 599, category: "wraps", alsoIn: ["chicken"], image: img("chicken-wrap"), imageAlt: "Grilled chicken wrap cut in half", bestSeller: true },
  { id: "bbq-chicken-wrap", name: "BBQ Chicken Wrap", description: "Chicken, smoky BBQ sauce and fresh vegetables.", price: 649, category: "wraps", image: img("bbq-chicken-wrap"), imageAlt: "Toasted chicken wraps with salad" },
  { id: "spicy-chicken-wrap", name: "Spicy Chicken Wrap", description: "Chicken with spicy sauce and crunchy vegetables.", price: 649, category: "wraps", image: img("spicy-chicken-wrap"), imageAlt: "Chicken wraps on a wooden board with dips" },
  { id: "veggie-wrap", name: "Veggie Wrap", description: "Fresh vegetables with a flavourful sauce.", price: 549, category: "wraps", image: img("veggie-wrap"), imageAlt: "Fresh vegetable rolls with herbs" },
  // Sides
  { id: "french-fries", name: "French Fries", description: "Crispy skin-on fries, lightly salted.", price: 299, category: "sides", image: img("fries"), imageAlt: "Tray of golden French fries" },
  { id: "loaded-fries", name: "Loaded Fries", description: "Fries topped with cheese, bacon and sauce.", price: 499, category: "sides", image: img("loaded-fries"), imageAlt: "Loaded fries topped with cheese and herbs" },
  { id: "onion-rings", name: "Onion Rings", price: 349, category: "sides", image: img("onion-rings"), imageAlt: "Golden battered onion rings" },
  { id: "mozzarella-sticks", name: "Mozzarella Sticks", price: 399, category: "sides", image: img("mozzarella-sticks"), imageAlt: "Breaded mozzarella sticks" },
  // Drinks
  { id: "coke", name: "Coke", price: 199, category: "drinks", image: img("soft-drink"), imageAlt: "Glass of cola with ice" },
  { id: "diet-coke", name: "Diet Coke", price: 199, category: "drinks", image: img("diet-cola"), imageAlt: "Tall glass of iced cola" },
  { id: "fanta", name: "Fanta", price: 199, category: "drinks", image: img("orange-soda"), imageAlt: "Glass of orange soda with orange slices" },
  { id: "sprite", name: "Sprite", price: 199, category: "drinks", image: img("lemon-lime-soda"), imageAlt: "Glass of lemon-lime soda with lemon slices" },
  // Desserts
  { id: "chocolate-cake", name: "Chocolate Cake", price: 399, category: "desserts", image: img("chocolate-cake"), imageAlt: "Chocolate cake with chocolate drip" },
  { id: "ice-cream", name: "Ice Cream", price: 299, category: "desserts", image: img("ice-cream"), imageAlt: "Scoops of vanilla ice cream with sprinkles" },
  { id: "cheesecake", name: "Cheesecake", price: 399, category: "desserts", image: img("cheesecake"), imageAlt: "Slice of blueberry cheesecake" },
  { id: "brownie", name: "Brownie", price: 299, category: "desserts", image: img("brownie"), imageAlt: "Squares of chocolate brownie" },
  { id: "chocolate-lava-cake", name: "Chocolate Lava Cake", description: "Warm chocolate cake with vanilla ice cream.", price: 399, category: "desserts", image: img("lava-cake"), imageAlt: "Chocolate cake covered in melted chocolate", bestSeller: true },
  // Combos
  { id: "classic-burger-meal", name: "Classic Burger Meal", description: "Burger + Fries + Drink", price: 699, category: "combos", image: img("classic-burger-meal"), imageAlt: "Burger served with fries and a dip" },
  { id: "chicken-bucket", name: "Chicken Bucket", description: "6 pcs Chicken + Fries + Dip", price: 999, category: "combos", image: img("chicken-bucket"), imageAlt: "Bucket of crispy fried chicken pieces" },
  { id: "chicken-wrap-combo", name: "Chicken Wrap Combo", description: "Wrap + Fries + Drink", price: 599, category: "combos", image: img("chicken-wrap-combo"), imageAlt: "Chicken wrap filled with fries and onions" },
];

const AVAILABLE = PRODUCTS.filter((p) => p.available !== false);
const BY_ID = new Map(AVAILABLE.map((p) => [p.id, p]));

export const getProduct = (id: string) => BY_ID.get(id);

export const productsInCategory = (category: CategoryId) =>
  AVAILABLE.filter((p) => p.category === category || p.alsoIn?.includes(category));

export const featuredProducts = (category: MenuCategory) =>
  category.featured.map(getProduct).filter((p): p is Product => Boolean(p));

export const BEST_SELLERS = AVAILABLE.filter((p) => p.bestSeller);

export const isCategoryId = (value: string | null): value is CategoryId =>
  MENU_CATEGORIES.some((c) => c.id === value);

// ---- Homepage category tiles (photo-led; each links into a menu category) ----

export interface CategoryTile {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
}

export const CATEGORY_TILES: readonly CategoryTile[] = [
  { id: "burgers", name: "Burgers", description: "Juicy & Fresh", image: "/images/cat-burgers.webp" },
  { id: "sides", name: "Fries", description: "Crispy & Golden", image: "/images/cat-fries.webp" },
  { id: "chicken", name: "Chicken", description: "Tender & Delicious", image: "/images/cat-chicken.webp" },
  { id: "wraps", name: "Wraps", description: "Fresh & Healthy", image: "/images/cat-wraps.webp" },
  { id: "drinks", name: "Drinks", description: "Cool & Refreshing", image: "/images/cat-drinks.webp" },
  { id: "desserts", name: "Desserts", description: "Sweet Endings", image: "/images/cat-desserts.webp" },
];

// ---- Deals: each one points at a real product, so cart lines merge with the menu ----

export interface Offer {
  productId: string;
  /** Pre-discount price in pence. */
  originalPrice: number;
  /** Badge figure as advertised (kept explicit rather than derived from rounded prices). */
  discountPercent: number;
}

const OFFER_DEFS: readonly Offer[] = [
  { productId: "classic-burger-meal", originalPrice: 899, discountPercent: 20 },
  { productId: "chicken-bucket", originalPrice: 1499, discountPercent: 30 },
  { productId: "chicken-wrap-combo", originalPrice: 699, discountPercent: 15 },
  { productId: "loaded-fries", originalPrice: 699, discountPercent: 25 },
];

export interface ResolvedOffer extends Offer {
  product: Product;
}

export const OFFERS: readonly ResolvedOffer[] = OFFER_DEFS.flatMap((offer) => {
  const product = getProduct(offer.productId);
  if (!product) return [];
  return [{ ...offer, product }];
});

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
export const formatPrice = (pence: number) => gbp.format(pence / 100);
