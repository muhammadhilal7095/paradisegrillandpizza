import { Link } from "react-router-dom";
import type { Category } from "../../data/menu";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/menu?category=${category.id}`}
      className="group flex flex-col items-center rounded-2xl px-2 py-3 text-center transition-colors duration-200 hover:bg-mist"
    >
      <span className="block size-[104px] overflow-hidden rounded-full bg-mist ring-1 ring-line transition-shadow duration-200 group-hover:ring-2 group-hover:ring-brand md:size-[120px]">
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
      <span className="mt-3.5 font-display text-[16px] font-bold text-ink transition-colors group-hover:text-brand">
        {category.name}
      </span>
      <span className="mt-0.5 text-[13px] text-muted">{category.description}</span>
    </Link>
  );
}
