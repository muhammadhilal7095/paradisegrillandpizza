/**
 * Gallery photos. Each entry uses a square menu photo in two sizes:
 * /images/menu/<id>-540.webp (grid) and -1080.webp (lightbox).
 * Every photo here is Paradise Grill and Pizza's own; add new ones in the matching category block below.
 */

export type GalleryCategoryId = "pizza" | "family-deals" | "chicken" | "chicken-meals" | "hot-wings" | "nuggets" | "peri-burger-meal" | "lamb-doner" | "kebabs" | "burgers" | "curries" | "naan" | "fish" | "dips" | "drinks" | "starters";

export interface GalleryCategory {
  id: GalleryCategoryId;
  label: string;
}

/** Filter order (after "All"). */
export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  { id: "pizza", label: "Pizza" },
  { id: "family-deals", label: "Family Deals" },
  { id: "chicken", label: "Fried Chicken" },
  { id: "chicken-meals", label: "Chicken Meals" },
  { id: "hot-wings", label: "Hot Wings" },
  { id: "nuggets", label: "Nuggets" },
  { id: "peri-burger-meal", label: "Peri Peri Burger Meal" },
  { id: "lamb-doner", label: "Paradise Lamb Doner" },
  { id: "kebabs", label: "Kebabs & Wraps" },
  { id: "burgers", label: "Burgers" },
  { id: "curries", label: "Curries" },
  { id: "naan", label: "Naan & Roti" },
  { id: "fish", label: "Fish" },
  { id: "dips", label: "Dips & Sauces" },
  { id: "drinks", label: "Drinks" },
  { id: "starters", label: "Starters" },
];

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategoryId;
  alt: string;
  description?: string;
  /** Lower comes first. */
  sortOrder: number;
  /** Set false to hide without deleting. */
  published?: boolean;
}

const ITEMS: readonly GalleryItem[] = [
  // Paradise Grill and Pizza's own pizza photos.
  { id: "pizza-mixed-meat-feast", title: "Mixed Meat Feast Pizza", category: "pizza", sortOrder: 0.5, alt: "Pizza loaded with pepperoni, spiced chicken, doner meat, peppers and red onion, with a cheesy slice being lifted" },
  { id: "pizza-cheese", title: "Cheese Pizza", category: "pizza", sortOrder: 0.6, alt: "Freshly baked cheese pizza with golden melted mozzarella" },
  // Paradise Grill and Pizza's own family deal photos.
  { id: "family-deal-wings-fries", title: "Family Chicken Deal", category: "family-deals", sortOrder: 1.05, alt: "Family chicken deal: a platter of crispy fried chicken and wings, two portions of fries, ketchup and a 1.5 litre Paradise cola" },
  // Paradise Grill and Pizza's own hot wings photos.
  { id: "hot-wings-platter", title: "Hot Wings Platter", category: "hot-wings", sortOrder: 2.05, alt: "Platter of crispy spicy hot wings with chilli flakes and a chilli dip" },
  { id: "hot-wings-spicy", title: "Spicy Hot Wings", category: "hot-wings", sortOrder: 3.05, alt: "Close-up of crispy spicy hot wings with sliced chillies and a chilli dip" },
  // Paradise Grill and Pizza's own peri peri meal photos.
  { id: "peri-peri-wings-meal", title: "5 Peri Peri Wings Meal", category: "peri-burger-meal", sortOrder: 1.33, alt: "Paradise 5 peri peri wings meal box with seasoned fries, garlic mayo and an iced cola" },
  { id: "popcorn-chicken-bucket-meal", title: "Popcorn Chicken Bucket Meal", category: "peri-burger-meal", sortOrder: 2.33, alt: "Paradise bucket of crispy popcorn chicken with fries and an iced cola" },
  // Paradise Grill and Pizza's own lamb doner photos.
  { id: "lamb-doner-naan-salad", title: "Lamb Doner with Naan & Salad", category: "lamb-doner", sortOrder: 1.35, alt: "Plate of sliced lamb doner meat with fresh salad, garlic yoghurt sauce and naan" },
  { id: "lamb-doner-chips", title: "Lamb Doner & Chips", category: "lamb-doner", sortOrder: 2.35, alt: "Plate of crispy sliced lamb doner meat with chips and salad" },
  // Paradise Grill and Pizza's own kebab photos.
  { id: "wrap-lamb-doner-fries", title: "Lamb Doner Wrap & Fries", category: "kebabs", sortOrder: 1.38, alt: "Lamb doner wrap with salad, garlic and chilli sauce, served with seasoned fries and a garlic dip" },
  { id: "wrap-lamb-tikka-fries", title: "Lamb Tikka Wrap & Fries", category: "kebabs", sortOrder: 1.39, alt: "Grilled lamb tikka wrap with salad, garlic and chilli sauce, served with seasoned fries and a garlic dip" },
  { id: "seekh-kebab-wrap", title: "Seekh Kebab Wrap", category: "kebabs", sortOrder: 1.4, alt: "Grilled seekh kebabs in a toasted flatbread wrap with lettuce, tomato, red onion, cucumber and garlic sauce" },
  { id: "seekh-kebab-wrap-triple", title: "Triple Seekh Kebab Wrap", category: "kebabs", sortOrder: 2.4, alt: "Three grilled seekh kebabs wrapped in flatbread with salad, garlic sauce and chilli dip" },
  // Paradise Grill and Pizza's own naan photos.
  { id: "naan-garlic", title: "Garlic Naan", category: "naan", sortOrder: 4.5, alt: "Fresh garlic naan brushed with butter, chopped garlic and coriander, with a yoghurt dip" },
  { id: "naan-keema", title: "Keema Naan", category: "naan", sortOrder: 5.5, alt: "Keema naan cut open to show spiced minced meat filling, topped with sesame and nigella seeds" },
  // Paradise Grill and Pizza's own nugget photos.
  { id: "nuggets-crispy", title: "Crispy Chicken Nuggets", category: "nuggets", sortOrder: 3.06, alt: "Golden crispy chicken nuggets, one broken open to show tender white chicken, with ketchup and fries" },
  { id: "nuggets-platter", title: "Chicken Nuggets Platter", category: "nuggets", sortOrder: 4.06, alt: "Platter of crispy chicken nuggets with fries and a ketchup dip" },
  // Paradise Grill and Pizza's own fish photos.
  { id: "fish-and-chips", title: "Fish & Chips", category: "fish", sortOrder: 4.6, alt: "Golden battered fish fillets with chips, lemon wedges and tartare sauce" },
  { id: "fish-masala-fried", title: "Masala Fried Fish", category: "fish", sortOrder: 5.6, alt: "Spicy masala fried fish pieces with lemon, red onion and fresh naan" },
  // Paradise Grill and Pizza's own starter photos.
  { id: "starter-cheesy-garlic-bread", title: "Cheesy Garlic Bread", category: "starters", sortOrder: 5.7, alt: "Sliced cheesy garlic bread with stretchy melted mozzarella, herbs and a tomato dip" },
  { id: "starter-loaded-cheese-fries", title: "Loaded Cheese Fries", category: "starters", sortOrder: 6.7, alt: "Fries loaded with melted cheese, garlic sauce, chilli flakes and parsley" },
  // Paradise Grill and Pizza's own drink photos.
  { id: "drink-paradise-cola-can", title: "Paradise Cola Can (330ml)", category: "drinks", sortOrder: 5.2, alt: "Ice-cold Paradise Grill & Pizzas cola can, 330ml, with ice cubes and splashes" },
  { id: "drink-paradise-cola-bottle", title: "Paradise Cola Bottle (1.5 Litre)", category: "drinks", sortOrder: 6.2, alt: "Chilled 1.5 litre Paradise Grill & Pizzas cola bottle with ice cubes and splashes" },
  // Paradise Grill and Pizza's own dip photos.
  { id: "dip-bbq-sauce", title: "Smoky BBQ Sauce", category: "dips", sortOrder: 5.1, alt: "Glass bowl of rich smoky BBQ sauce with garlic and chillies" },
  { id: "dip-sweet-chilli", title: "Sweet Chilli Sauce", category: "dips", sortOrder: 6.1, alt: "Glass bowl of sweet chilli sauce with chilli flakes and seeds" },
  { id: "dip-garlic-mayo", title: "Garlic Mayo", category: "dips", sortOrder: 7.1, alt: "Glass bowl of creamy garlic mayo with chopped parsley" },
  { id: "dip-spicy-mayo", title: "Spicy Mayo", category: "dips", sortOrder: 8.1, alt: "Glass bowl of creamy spicy mayo with red and green peppers" },
  // Paradise Grill and Pizza's own curry photos.
  { id: "curry-chicken-tikka-masala", title: "Chicken Tikka Masala", category: "curries", sortOrder: 1.3, alt: "Chicken tikka masala in a copper bowl with cream and coriander, served with naan" },
  { id: "curry-lamb-karahi", title: "Lamb Karahi", category: "curries", sortOrder: 2.3, alt: "Lamb karahi on the bone with green chillies, ginger and coriander in a copper bowl, with naan" },
  { id: "curry-lamb-masala", title: "Lamb Masala", category: "curries", sortOrder: 3.3, alt: "Creamy lamb masala curry in an iron karahi with green chillies and ginger, with naan" },
  { id: "curry-chicken-karahi", title: "Chicken Karahi", category: "curries", sortOrder: 4.3, alt: "Spicy chicken karahi with drumsticks, green chillies and coriander in a white bowl" },
  // Paradise Grill and Pizza's own chicken meal photos (chicken, fries and a drink).
  { id: "chicken-meal-classic", title: "Classic Chicken Meal", category: "chicken-meals", sortOrder: 1.1, alt: "Paradise chicken meal: crispy fried chicken drumsticks, seasoned fries in a Paradise box, an iced cola and ketchup" },
  { id: "chicken-meal-hot-crispy", title: "Hot & Crispy Chicken Meal", category: "chicken-meals", sortOrder: 2.1, alt: "Hot crispy fried chicken with Paradise-branded fries and a cold drink" },
  { id: "chicken-meal-family", title: "Chicken Meal with Dips", category: "chicken-meals", sortOrder: 3.1, alt: "Crispy fried chicken pieces with Paradise fries, an iced cola, ketchup and garlic mayo" },
  { id: "chicken-meal-spicy", title: "Spicy Chicken Meal", category: "chicken-meals", sortOrder: 4.1, alt: "Spicy fried chicken with seasoned fries, a Paradise-branded drink and dips" },
  // Paradise Grill and Pizza's own fried chicken photos.
  { id: "crispy-chicken-drumsticks-fries", title: "Crispy Fried Chicken & Fries", category: "chicken", sortOrder: 1.2, alt: "Crispy golden fried chicken drumsticks with fries, ketchup and sliced chillies" },
  { id: "fried-chicken-basket", title: "Fried Chicken Basket", category: "chicken", sortOrder: 2.2, alt: "Basket of crispy fried chicken pieces with ketchup, fries and a cold drink" },
  { id: "spicy-fried-drumsticks", title: "Spicy Fried Drumsticks", category: "chicken", sortOrder: 3.2, alt: "Two spicy crispy chicken drumsticks with ketchup, salad and fries" },
  { id: "crispy-chicken-drumstick", title: "Crispy Chicken Drumstick", category: "chicken", sortOrder: 4.2, alt: "Close-up of a golden crispy fried chicken drumstick with ketchup and chillies" },
  // Paradise Grill and Pizza's own burger photos.
  { id: "crispy-chicken-burger-fries", title: "Crispy Chicken Burger & Fries", category: "burgers", sortOrder: 1.5, alt: "Crispy chicken burger with cheese, lettuce, tomato and red onion, with a basket of fries and ketchup" },
  { id: "double-beef-smash-burger", title: "Double Beef Smash Burger", category: "burgers", sortOrder: 2.5, alt: "Double beef burger with melted cheese, lettuce, tomato and red onion, with fries" },
  { id: "crispy-chicken-cheese-burger", title: "Crispy Chicken Cheese Burger", category: "burgers", sortOrder: 3.5, alt: "Crispy chicken fillet burger with melted cheese, fresh lettuce, tomato and creamy sauce" },
  { id: "double-cheeseburger-fries", title: "Double Cheeseburger Meal", category: "burgers", sortOrder: 4.5, alt: "Stacked double cheeseburger with fresh salad and sauce, served with crinkle fries" },
];

/** How many photos "All" shows before "Show more". */
export const GALLERY_INITIAL_COUNT = 12;

export const galleryImage = (item: GalleryItem, size: 540 | 1080) => `/images/menu/${item.id}-${size}.webp`;

export const GALLERY_ITEMS: readonly GalleryItem[] = ITEMS.filter((i) => i.published !== false).sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

export const isGalleryCategory = (value: string | null): value is GalleryCategoryId =>
  GALLERY_CATEGORIES.some((c) => c.id === value);

export const galleryCategoryLabel = (id: GalleryCategoryId) => GALLERY_CATEGORIES.find((c) => c.id === id)?.label ?? id;
