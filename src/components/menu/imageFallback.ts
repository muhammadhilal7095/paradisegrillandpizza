import type { SyntheticEvent } from "react";
import { FALLBACK_PHOTO, menuImage, PLACEHOLDER_IMG_CLASSES, type Product } from "../../data/menu";

/** onError handler: if a POS photo fails to load, show the product's stand-in stock photo, else the restaurant badge. */
export function fallbackImage(product: Pick<Product, "stockImage">) {
  return (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const stock = product.stockImage ? menuImage(product.stockImage) : undefined;
    const next = stock && !img.src.endsWith(stock) ? stock : FALLBACK_PHOTO;
    if (img.src.endsWith(next)) return;
    img.removeAttribute("srcset");
    img.src = next;
    if (next === FALLBACK_PHOTO) {
      img.classList.remove("object-cover", "object-contain");
      img.classList.add(...PLACEHOLDER_IMG_CLASSES);
    }
  };
}
