import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CategoryTile } from "../../data/menu";

export function CategoryCard({ category }: { category: CategoryTile }) {
  return (
    <Link
      to={`/menu?category=${category.id}`}
      className="group flex flex-col items-center rounded-2xl px-2 py-3 text-center transition-colors duration-200 hover:bg-mist"
    >
      {/* Red ring with a small gap around the photo, as in the brand design. */}
      <span className="block rounded-full p-1 ring-2 ring-brand/80 transition-shadow duration-200 group-hover:ring-brand">
        <span className="block size-[96px] overflow-hidden rounded-full bg-mist md:size-[112px]">
          <img
            src={category.image}
            alt=""
            width={320}
            height={320}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
          />
        </span>
      </span>
      <span className="mt-3.5 font-display text-[16px] font-bold text-ink transition-colors group-hover:text-brand">
        {category.name}
      </span>
      <span className="mt-0.5 text-[13px] text-muted">{category.description}</span>
      <ArrowRight
        size={16}
        strokeWidth={2.2}
        aria-hidden="true"
        className="mt-3 text-ink transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand"
      />
    </Link>
  );
}
