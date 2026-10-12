/**
 * Gallery photos. Each entry is one independent image in two sizes:
 * /images/gallery/<slug>-600.webp (grid) and -1200.webp (lightbox).
 * Behind-the-scenes entries are stock placeholders — replace them with real BurgerBite kitchen photos.
 */

export type GalleryCategoryId = "burgers" | "fries" | "chicken" | "wraps" | "drinks" | "desserts" | "behind-the-scenes";

export interface GalleryCategory {
  id: GalleryCategoryId;
  label: string;
}

/** Filter order (after "All"). */
export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  { id: "burgers", label: "Burgers" },
  { id: "fries", label: "Fries" },
  { id: "chicken", label: "Chicken" },
  { id: "wraps", label: "Wraps" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
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
  { id: "classic-burger", title: "Classic Burger", category: "burgers", sortOrder: 1, alt: "Beef burger with cheese, lettuce and tomato in a sesame bun" },
  { id: "chicken-bucket", title: "Crispy Chicken Bucket", category: "chicken", sortOrder: 2, alt: "Bucket of golden fried chicken pieces" },
  { id: "loaded-fries", title: "Loaded Fries", category: "fries", sortOrder: 3, alt: "Fries topped with melted cheese and herbs in a paper-lined basket" },
  { id: "chicken-wraps", title: "Chicken Wraps", category: "wraps", sortOrder: 4, alt: "Grilled chicken wraps with dips on a wooden board" },
  { id: "cheeseburger", title: "Signature Cheeseburger", category: "burgers", sortOrder: 5, alt: "Double cheeseburger with melted cheese on a dark background" },
  { id: "chicken-wings", title: "Crispy Chicken Wings", category: "chicken", sortOrder: 6, alt: "Glazed chicken wings with a creamy dip" },
  { id: "onion-rings", title: "Onion Rings", category: "fries", sortOrder: 7, alt: "Pile of golden battered onion rings" },
  { id: "iced-cola", title: "Iced Cola", category: "drinks", sortOrder: 8, alt: "Tall glass of iced cola on a bar" },
  { id: "on-the-grill", title: "On the Grill", category: "behind-the-scenes", sortOrder: 9, alt: "Chef working at a flaming grill in a busy kitchen" },
  { id: "orange-soda", title: "Orange Soda", category: "drinks", sortOrder: 10, alt: "Glass of orange soda surrounded by fresh oranges" },
  { id: "chocolate-cake", title: "Chocolate Cake", category: "desserts", sortOrder: 11, alt: "Chocolate cake with chocolate drip and piped frosting" },
  { id: "burger-fries-combo", title: "Burger & Fries Combo", category: "burgers", sortOrder: 12, alt: "Burger served with fries and a dip on a plate" },
  { id: "double-cheeseburger", title: "Double Cheeseburger", category: "burgers", sortOrder: 13, alt: "Double beef cheeseburger with pickles" },
  { id: "grilled-chicken-wrap", title: "Grilled Chicken Wrap", category: "wraps", sortOrder: 14, alt: "Grilled chicken wrap cut in half showing the filling" },
  { id: "golden-fries", title: "Golden Fries", category: "fries", sortOrder: 15, alt: "Tray of golden French fries" },
  { id: "finishing-touches", title: "Finishing Touches", category: "behind-the-scenes", sortOrder: 16, alt: "Chef carefully plating food with tweezers under warm lights" },
  { id: "crispy-drumsticks", title: "Crispy Drumsticks", category: "chicken", sortOrder: 17, alt: "Fried chicken drumsticks on a cooling rack" },
  { id: "brownie-sundae", title: "Brownie Sundae", category: "desserts", sortOrder: 18, alt: "Chocolate brownie topped with ice cream and chocolate sauce" },
  { id: "lemon-lime-soda", title: "Lemon-Lime Soda", category: "drinks", sortOrder: 19, alt: "Glass of lemon-lime soda with lemon slices and mint" },
  { id: "fresh-prep", title: "Fresh Prep", category: "behind-the-scenes", sortOrder: 20, alt: "Fresh vegetables, eggs and herbs laid out on a chopping board" },
  { id: "mozzarella-sticks", title: "Mozzarella Sticks", category: "fries", sortOrder: 21, alt: "Breaded mozzarella sticks on a board" },
];

/** How many photos "All" shows before "Show more". */
export const GALLERY_INITIAL_COUNT = 12;

export const galleryImage = (item: GalleryItem, size: 600 | 1200) => `/images/gallery/${item.id}-${size}.webp`;

export const GALLERY_ITEMS: readonly GalleryItem[] = ITEMS.filter((i) => i.published !== false).sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

export const isGalleryCategory = (value: string | null): value is GalleryCategoryId =>
  GALLERY_CATEGORIES.some((c) => c.id === value);

export const galleryCategoryLabel = (id: GalleryCategoryId) => GALLERY_CATEGORIES.find((c) => c.id === id)?.label ?? id;
