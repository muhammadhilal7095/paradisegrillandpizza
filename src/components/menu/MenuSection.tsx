import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MenuCategory, Product } from "../../data/menu";
import { buttonClasses } from "../ui/button";
import { CATEGORY_ICONS } from "./categoryIcons";
import { ProductCard } from "./ProductCard";

interface MenuSectionProps {
  category: MenuCategory;
  products: Product[];
  /** "featured" = one section of the full menu; "all" = the filtered single-category view. */
  mode: "featured" | "all";
}

export function MenuSection({ category, products, mode }: MenuSectionProps) {
  const Icon = CATEGORY_ICONS[category.id];
  const headingId = `${category.id}-title`;

  return (
    <section
      id={category.id}
      aria-labelledby={headingId}
      // Clears the sticky header + category strip when jumped to.
      className="scroll-mt-[140px] lg:scroll-mt-[196px]"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <h2 id={headingId} className="flex items-center gap-2 font-display text-[22px] leading-tight font-bold text-ink desk:text-[24px]">
            <Icon size={22} strokeWidth={2} aria-hidden="true" className="text-brand" />
            {mode === "all" ? `All ${category.name}` : category.name}
          </h2>
          <p className="mt-1 text-[13px] text-muted">{category.tagline}</p>
        </div>
        {mode === "featured" ? (
          products.length > 0 && (
            <Link
              to={`/menu?category=${category.id}`}
              className="inline-flex min-h-10 items-center gap-1 text-[13px] font-semibold text-brand-dark transition-colors hover:text-ink"
            >
              View All {category.name}
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          )
        ) : (
          <Link
            to={`/menu#${category.id}`}
            className="inline-flex min-h-10 items-center gap-1 text-[13px] font-semibold text-ink transition-colors hover:text-brand"
          >
            <ArrowLeft size={15} strokeWidth={2.2} aria-hidden="true" />
            Full menu
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        <ul
          className={`mt-5 grid gap-3 md:gap-4 ${
            category.compact
              ? "grid-cols-2 md:grid-cols-4"
              : "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {products.map((product) => (
            <li key={product.id} className="flex [&>article]:flex-1">
              <ProductCard product={product} variant={category.compact ? "compact" : "full"} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-line bg-mist px-6 py-8 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-brand">
            <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <p className="mt-3 font-display text-[16px] font-bold text-ink">{category.name} is coming soon</p>
          <p className="mt-1 max-w-sm text-[13px] text-muted">
            It isn't on the menu just yet. In the meantime, our combos are a great way to try a bit of everything.
          </p>
          <Link to="/menu#combos" className={buttonClasses("outlineDark", "sm", "mt-4 bg-white")}>
            See combos
          </Link>
        </div>
      )}
    </section>
  );
}
