import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { MenuCategory, Product } from "../../data/menu";
import { categoryIcon } from "./categoryIcons";
import { MenuItemRow } from "./MenuItemRow";

interface MenuSectionProps {
  category: MenuCategory;
  products: Product[];
  /** On a single-category page, show a link back to the full menu. */
  backLink?: boolean;
}

/** One category of the menu: heading with item count, then every item as a menu row (two columns on wide screens). */
export function MenuSection({ category, products, backLink = false }: MenuSectionProps) {
  const Icon = categoryIcon(category.name);
  const headingId = `${category.id}-title`;

  return (
    <section id={category.id} aria-labelledby={headingId} className="scroll-mt-[132px] md:scroll-mt-[140px]">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
        <h2 id={headingId} className="flex items-center gap-2.5 font-display text-[21px] leading-tight font-bold text-ink md:text-[24px]">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
          </span>
          {category.name}
          <span className="text-[14px] font-medium text-muted">({products.length})</span>
        </h2>
        {backLink && (
          <Link to="/menu" className="inline-flex min-h-10 shrink-0 items-center gap-1 text-[13px] font-semibold text-ink transition-colors hover:text-brand">
            <ArrowLeft size={15} strokeWidth={2.2} aria-hidden="true" />
            Full menu
          </Link>
        )}
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
        {products.map((product) => (
          <li key={product.id}>
            <MenuItemRow product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
