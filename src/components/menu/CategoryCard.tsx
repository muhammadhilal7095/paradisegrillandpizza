import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { isPlaceholderImage, menuImage, menuSrcSet, PLACEHOLDER_IMG_CLASSES, stockPhotoFor, type MenuCategory } from "../../data/menu";
import { fallbackImage } from "./imageFallback";

/** Square (1:1, like the POS's 1080×1080 photos) tile linking to a category page. The whole photo is shown, never cropped. */
export function CategoryCard({ category }: { category: MenuCategory }) {
  return (
    <Link to={`/menu/${category.id}`} className="group block rounded-2xl">
      <span className="relative block aspect-square overflow-hidden rounded-2xl border border-line bg-white">
        <img
          src={menuImage(category.tile)}
          srcSet={menuSrcSet(category.tile)}
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
          alt=""
          onError={fallbackImage({ stockImage: stockPhotoFor("", category.name) })}
          width={1080}
          height={1080}
          loading="lazy"
          decoding="async"
          className={`size-full transition-transform duration-300 group-hover:scale-[1.05] ${isPlaceholderImage(category.tile) ? PLACEHOLDER_IMG_CLASSES.join(" ") : "object-contain"}`}
        />
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_2px_8px_rgba(17,17,17,0.12)] transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white"
        >
          <ArrowRight size={17} strokeWidth={2.2} />
        </span>
      </span>
      <span className="mt-3 block font-display text-[16px] leading-tight font-bold text-ink transition-colors group-hover:text-brand md:text-[17px]">
        {category.name}
      </span>
      <span className="mt-0.5 block text-[13px] text-muted">{category.short}</span>
    </Link>
  );
}
