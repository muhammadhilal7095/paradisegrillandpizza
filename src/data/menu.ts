/**
 * Menu types and helpers. There is NO built-in menu: every product and category comes from the
 * POS API (see lib/products.ts) and is served to components by context/MenuContext.tsx.
 */

/** Category slug, made from the portal's category name (e.g. "Starters & Sides" → "starters-and-sides"). */
export type CategoryId = string;

/** Neutral photo for products and categories that have no image in the POS. */
export const FALLBACK_PHOTO = "/images/brand/logo-512.webp";

// ---------- Options (sizes, extras) — only used if the POS ever sends them ----------

export interface OptionChoice {
  id: string;
  label: string;
  /** Added to the base price, in pence. */
  price?: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  /** "single" = pick exactly one (first choice is the default); "multi" = pick any. */
  type: "single" | "multi";
  choices: readonly OptionChoice[];
}

/** groupId → chosen choice ids. */
export type Selections = Record<string, string[]>;

// ---------- Categories ----------

export interface MenuCategory {
  id: CategoryId;
  /** Exactly as named in the portal. */
  name: string;
  /** Short line on category tiles. */
  short: string;
  /** Shown under the section heading. */
  tagline: string;
  /** Category page intro. */
  intro: string;
  /** Square tile photo: the first product photo in the category, or FALLBACK_PHOTO. */
  tile: string;
  /** Wide decorative hero (/images/hero/<hero>-960|1920.webp), picked from the category name. */
  hero: string;
  heroAlt: string;
  /** Drinks and desserts use the smaller card. */
  compact?: boolean;
}

/** Decorative banner photo for a category, chosen from words in its name. Not product data. */
const HERO_BY_NAME: [RegExp, string, string][] = [
  [/pizza/i, "pizza", "Pepperoni pizza with melted mozzarella on a dark board"],
  [/burger/i, "burgers", "Cheeseburger on a dark background"],
  [/peri|piri/i, "peri-peri", "Spicy chicken wings charring on a grill"],
  [/kebab|wrap|doner|shawarma/i, "kebabs", "Doner meat turning on a rotisserie"],
  [/grill|chicken|shish|tikka/i, "grilled-chicken", "Chicken skewers on a charcoal grill"],
  [/curr|karahi|masala/i, "curries", "Pan of curry topped with coriander"],
  [/drink|beverage|soda|juice|shake/i, "drinks", "Glass of iced drink"],
  [/dessert|sweet|cake|ice cream/i, "desserts", "Brownie topped with ice cream"],
  [/deal|offer|combo|bundle|meal/i, "deals", "Basket of crispy fried chicken with a dipping sauce"],
  [/side|starter|fries|chips|bread/i, "sides", "Cheesy garlic bread"],
];

/** Words in a category name that mean "these are deals" (shown on the Deals page and homepage). */
export const DEAL_CATEGORY = /deal|offer|combo|bundle/i;

export function makeCategory(id: string, name: string): MenuCategory {
  const [, hero, heroAlt] = HERO_BY_NAME.find(([re]) => re.test(name)) ?? [null, "menu", "Platter of grilled food with dips"];
  const lower = name.toLowerCase();
  return {
    id,
    name,
    short: "View all",
    tagline: `Our ${lower}, freshly prepared.`,
    intro: `Explore our ${lower}, made fresh when you order.`,
    tile: FALLBACK_PHOTO,
    hero,
    heroAlt,
    compact: /drink|beverage|soda|dessert|sweet/i.test(name),
  };
}

// ---------- Products ----------

export interface Product {
  /** Site id ("pos-<POS id>"), used in URLs and the cart. */
  id: string;
  /** The POS API's own id. */
  apiId?: string;
  name: string;
  description?: string;
  /** Price in pence (after any POS discount). */
  price: number;
  /** Price before the POS discount, in pence; shown struck through. */
  originalPrice?: number;
  category: CategoryId;
  /** Extra categories the product is also listed under. */
  alsoIn?: CategoryId[];
  /** Full photo URL from the POS. */
  imageUrl?: string;
  /** Stand-in stock photo (see stockPhotoFor), shown when the POS has no photo for this product. */
  stockImage?: string;
  imageAlt: string;
  options?: readonly OptionGroup[];
  bestSeller?: boolean;
  /** Small label on the card, e.g. "Spicy". */
  tag?: string;
  available?: boolean;
}

export type Catalog = ReturnType<typeof createCatalog>;

/** Lookups over the products (and categories) loaded from the POS API. */
export function createCatalog(products: readonly Product[], categoryList: readonly MenuCategory[] = []) {
  const seen = new Set<string>();
  const available = products.filter((p) => p.available !== false && !seen.has(p.id) && seen.add(p.id));
  const byId = new Map(available.map((p) => [p.id, p]));
  const getProduct = (id: string) => byId.get(id);

  /** The category's own products first, then ones cross-listed from other categories. */
  const productsInCategory = (category: CategoryId) => [
    ...available.filter((p) => p.category === category),
    ...available.filter((p) => p.category !== category && p.alsoIn?.includes(category)),
  ];

  /** Up to four items per category for the full menu. */
  const featuredProducts = (category: MenuCategory) => productsInCategory(category.id).slice(0, 4);

  // Each category's tile: its POS image, else its first product photo, else a stand-in for its name, else its first product's stand-in.
  const categories = categoryList
    .map((c) => {
      const inCategory = available.filter((p) => p.category === c.id);
      if (c.tile !== FALLBACK_PHOTO) return c; // the POS category's own image
      const photo = inCategory.find((p) => p.imageUrl)?.imageUrl ?? stockPhotoFor("", c.name) ?? inCategory.find((p) => p.stockImage)?.stockImage;
      return photo ? { ...c, tile: photo } : c;
    })
    .filter((c) => productsInCategory(c.id).length > 0);
  const getCategory = (id: string) => categories.find((c) => c.id === id);

  /** POS-flagged favourites first, topped up to at least 8 with the first items of each category. */
  const flagged = available.filter((p) => p.bestSeller);
  const fillers = categories.filter((c) => !c.compact).flatMap((c) => productsInCategory(c.id).slice(0, 2));
  const bestSellers = [...flagged, ...fillers.filter((p) => !flagged.includes(p))].slice(0, Math.max(8, flagged.length));

  /** Products in deal categories ("Meal Deals", "Offers", "Combos"…). */
  const dealProducts = categories.filter((c) => DEAL_CATEGORY.test(c.name)).flatMap((c) => productsInCategory(c.id));

  return { products: available, categories, getCategory, getProduct, productsInCategory, featuredProducts, bestSellers, dealProducts };
}

/** Nothing loaded yet. */
export const EMPTY_CATALOG = createCatalog([]);

// ---------- Images ----------

/**
 * Stand-in stock photos for POS products without their own image, matched on the product name plus its
 * category name: most specific first. Values are files in /images/menu (Unsplash stock, see CREDITS.md).
 */
const STOCK_PHOTOS: [RegExp, string][] = [
  // Pizza
  [/margherita/, "margherita"],
  [/pepperoni/, "pepperoni"],
  [/(bbq|chicken).*pizza|pizza.*(bbq|chicken)/, "bbq-chicken-pizza"],
  [/(veg|vegetarian|vegan).*pizza|pizza.*(veg|vegetarian|vegan)/, "veggie-supreme"],
  [/(meat|feast|hot ?shot|mighty).*pizza|pizza.*(meat|feast)/, "meat-feast"],
  [/pizza/, "cat-pizza"],
  // Sides & starters (before chicken, so "chicken wings" and "garlic bread" match here)
  [/peri.*wing|wing.*peri/, "peri-wings"],
  [/wing/, "chicken-wings"],
  [/cheesy garlic|garlic bread.*chees|garlic.*cheese/, "cheesy-garlic-bread"],
  [/garlic bread|garlic naan/, "garlic-bread"],
  [/loaded/, "loaded-fries"],
  [/fries|chips/, "french-fries"],
  [/onion ring/, "onion-rings"],
  [/mozzarella|cheese stick/, "mozzarella-sticks"],
  // Burgers
  [/(double|cheese).*burger/, "cheese-burger"],
  [/burger/, "classic-burger"],
  // Peri peri, kebabs, grill
  [/peri|piri/, "peri-half-chicken"],
  [/shawarma|wrap/, "chicken-shawarma-wrap"],
  [/mixed.*(kebab|doner)/, "mixed-kebab-plate"],
  [/doner|kebab|gyro/, "lamb-doner-kebab"],
  [/mixed.*(grill|platter)|platter/, "mixed-grill"],
  [/shish|skewer/, "chicken-shish"],
  // Curries
  [/tikka masala/, "chicken-tikka-masala"],
  [/butter chicken|makhani/, "butter-chicken"],
  [/karahi/, "chicken-karahi"],
  [/curr|masala|korma|bhuna|jalfrezi|balti|madras|vindaloo|biryani/, "cat-curries"],
  [/tikka/, "chicken-tikka-skewers"],
  [/grill|chicken/, "cat-grilled-chicken"],
  // Drinks
  [/fanta|orange/, "fanta"],
  [/sprite|7 ?up|lemonade|lemon/, "sprite"],
  [/cola|coke|pepsi/, "coke"],
  [/drink|soda|juice|water|beverage/, "cat-drinks"],
  // Desserts
  [/lava|molten/, "chocolate-lava-cake"],
  [/cheesecake/, "cheesecake"],
  [/brownie/, "brownie"],
  [/ice ?cream|gelato|sundae/, "ice-cream"],
  [/cake|gateau/, "chocolate-cake"],
  [/dessert|sweet/, "cat-desserts"],
  // Deals & everything else
  [/wing.*box|box.*wing/, "wings-box"],
  [/deal|feast|combo|bundle|family|sharing/, "pizza-night-for-two"],
  [/side|starter/, "cat-sides"],
];

/**
 * The best-matching stand-in photo: the product's own name decides first, its category name only if
 * the name matches nothing. Undefined when neither fits (the restaurant badge is shown then).
 */
export function stockPhotoFor(productName: string, categoryName = ""): string | undefined {
  const match = (text: string) => (text ? STOCK_PHOTOS.find(([re]) => re.test(text.toLowerCase()))?.[1] : undefined);
  return match(productName) ?? match(categoryName);
}

const isUrl = (name: string) => /^(https?:)?\/\//i.test(name) || name.startsWith("/");

/** Square photo: full URLs pass through; bare names are local files in /images/menu (site imagery, not menu data). */
export const menuImage = (name: string, size: 540 | 1080 = 540) => (isUrl(name) ? name : `/images/menu/${name}-${size}.webp`);
export const menuSrcSet = (name: string) => (isUrl(name) ? undefined : `${menuImage(name, 540)} 540w, ${menuImage(name, 1080)} 1080w`);
/** The POS photo, else a matching stand-in stock photo, else the restaurant badge. */
export const productImageName = (p: Product) => p.imageUrl ?? p.stockImage ?? FALLBACK_PHOTO;

/** Classes for an <img> showing FALLBACK_PHOTO: a smaller, centred badge instead of a cropped photo. */
export const PLACEHOLDER_IMG_CLASSES = ["object-contain", "p-[18%]", "opacity-90"];
export const isPlaceholderImage = (src: string) => src.endsWith(FALLBACK_PHOTO);

/** Wide banner photo. */
export const heroImage = (name: string, alt: string) => ({
  small: `/images/hero/${name}-960.webp`,
  large: `/images/hero/${name}-1920.webp`,
  width: 1920,
  height: 880,
  alt,
});

// ---------- Prices ----------

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
export const formatPrice = (pence: number) => gbp.format(pence / 100);
/** Whole pounds drop the pence (£25 rather than £25.00). For notes, not item prices. */
export const formatShortPrice = (pence: number) => (pence % 100 === 0 ? `£${pence / 100}` : formatPrice(pence));

// ---------- Option pricing ----------

/** Defaults: first choice of every single-choice group, nothing for multi groups. */
export function defaultSelections(product: Product): Selections {
  return Object.fromEntries((product.options ?? []).map((g) => [g.id, g.type === "single" ? [g.choices[0].id] : []]));
}

/** Drops unknown groups/choices and fills missing single-choice groups with their default. */
export function normaliseSelections(product: Product, selections: Selections): Selections {
  const result: Selections = {};
  for (const group of product.options ?? []) {
    const valid = (selections[group.id] ?? []).filter((id) => group.choices.some((c) => c.id === id));
    result[group.id] = group.type === "single" ? [valid[0] ?? group.choices[0].id] : group.choices.filter((c) => valid.includes(c.id)).map((c) => c.id);
  }
  return result;
}

/** Unit price in pence for a product with the given options. */
export function unitPrice(product: Product, selections: Selections) {
  let total = product.price;
  for (const group of product.options ?? []) {
    for (const choice of group.choices) {
      if (selections[group.id]?.includes(choice.id)) total += choice.price ?? 0;
    }
  }
  return total;
}

/** Human-readable option labels. */
export function describeSelections(product: Product, selections: Selections) {
  return (product.options ?? []).flatMap((group) =>
    group.choices.filter((c) => selections[group.id]?.includes(c.id)).map((c) => c.label),
  );
}

/** Cheapest price a customer can pay: base price plus the cheapest choice of each "choose one" option
 *  (pizzas priced only by size have a £0 base in the POS). Pass `originalPrice` for the struck-through price. */
export function startingPrice(product: Product, base = product.price) {
  let total = base;
  for (const group of product.options ?? []) {
    if (group.type === "single" && group.choices.length) total += Math.min(...group.choices.map((c) => c.price ?? 0));
  }
  return total;
}

/** True when options can change the price (cards then show "from £x"). */
export const hasPricedOptions = (product: Product) =>
  (product.options ?? []).some((g) => g.choices.some((c) => (c.price ?? 0) > 0));

/** Stable cart line id: same product + same options = same line. */
export function lineId(product: Product, selections: Selections) {
  const parts = (product.options ?? [])
    .map((g) => `${g.id}=${[...(selections[g.id] ?? [])].sort().join("+")}`)
    .filter((p) => !p.endsWith("="));
  return parts.length ? `${product.id}|${parts.join("|")}` : product.id;
}
