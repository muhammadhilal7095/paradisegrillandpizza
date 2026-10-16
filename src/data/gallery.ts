/**
 * Gallery photos. Each entry uses a square menu photo in two sizes:
 * /images/menu/<id>-540.webp (grid) and -1080.webp (lightbox).
 * These are Unsplash stock photos; swap in photos of the restaurant's own food and kitchen when available.
 */

export type GalleryCategoryId = "pizza" | "grill" | "kebabs" | "burgers" | "curries" | "sides";

export interface GalleryCategory {
  id: GalleryCategoryId;
  label: string;
}

/** Filter order (after "All"). */
export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  { id: "pizza", label: "Pizza" },
  { id: "grill", label: "Grill & Peri Peri" },
  { id: "kebabs", label: "Kebabs & Wraps" },
  { id: "burgers", label: "Burgers" },
  { id: "curries", label: "Curries" },
  { id: "sides", label: "Sides & Desserts" },
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
  { id: "pepperoni", title: "Pepperoni Pizza", category: "pizza", sortOrder: 1, alt: "Pepperoni pizza with melted mozzarella" },
  { id: "peri-half-chicken", title: "Peri Peri Half Chicken", category: "grill", sortOrder: 2, alt: "Flame-grilled peri peri chicken on a rack" },
  { id: "lamb-doner-kebab", title: "Lamb Doner Kebab", category: "kebabs", sortOrder: 3, alt: "Lamb doner kebab with salad in a pitta" },
  { id: "chicken-tikka-masala", title: "Chicken Tikka Masala", category: "curries", sortOrder: 4, alt: "Bowl of creamy chicken tikka masala" },
  { id: "margherita", title: "Margherita", category: "pizza", sortOrder: 5, alt: "Margherita pizza with basil leaves" },
  { id: "chicken-shish", title: "Chicken Shish", category: "grill", sortOrder: 6, alt: "Chicken skewers on a charcoal grill" },
  { id: "classic-burger", title: "Classic Beef Burger", category: "burgers", sortOrder: 7, alt: "Beef burger with lettuce, tomato and onion" },
  { id: "cheesy-garlic-bread", title: "Cheesy Garlic Bread", category: "sides", sortOrder: 8, alt: "Garlic bread topped with melted cheese" },
  { id: "veggie-supreme", title: "Veggie Supreme", category: "pizza", sortOrder: 9, alt: "Colourful vegetable pizza cut into slices" },
  { id: "peri-wings", title: "Peri Peri Wings", category: "grill", sortOrder: 10, alt: "Spicy chicken wings with peppers" },
  { id: "chicken-shawarma-wrap", title: "Chicken Shawarma Wrap", category: "kebabs", sortOrder: 11, alt: "Chicken shawarma wrap with garlic sauce" },
  { id: "butter-chicken", title: "Butter Chicken", category: "curries", sortOrder: 12, alt: "Butter chicken curry with cream and coriander" },
  { id: "meat-feast", title: "Meat Feast", category: "pizza", sortOrder: 13, alt: "Pizza loaded with sliced sausage" },
  { id: "mixed-grill", title: "Mixed Grill Platter", category: "grill", sortOrder: 14, alt: "Platter of grilled meats and vegetables" },
  { id: "cheese-burger", title: "Double Cheeseburger", category: "burgers", sortOrder: 15, alt: "Double cheeseburger with melted cheese" },
  { id: "loaded-fries", title: "Loaded Fries", category: "sides", sortOrder: 16, alt: "Fries topped with cheese and herbs" },
  { id: "mixed-kebab-plate", title: "Mixed Kebab Plate", category: "kebabs", sortOrder: 17, alt: "Plate of mixed doner meat" },
  { id: "chicken-karahi", title: "Chicken Karahi", category: "curries", sortOrder: 18, alt: "Chicken karahi curry in a bowl" },
  { id: "chicken-tikka-skewers", title: "Chicken Tikka", category: "grill", sortOrder: 19, alt: "Chunks of grilled chicken tikka" },
  { id: "chocolate-lava-cake", title: "Chocolate Lava Cake", category: "sides", sortOrder: 20, alt: "Chocolate cake covered in melted chocolate" },
  { id: "bbq-chicken-pizza", title: "BBQ Chicken Pizza", category: "pizza", sortOrder: 21, alt: "Cheesy pizza topped with chicken" },
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
