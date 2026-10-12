import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/menu/ProductCard";
import { CATEGORIES, isCategoryId, PRODUCTS } from "../data/menu";

const FILTERS = [{ id: null, name: "All" }, ...CATEGORIES.map(({ id, name }) => ({ id, name }))];

export function MenuPage() {
  const [params] = useSearchParams();
  const raw = params.get("category");
  const active = isCategoryId(raw) ? raw : null;
  const products = active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS;
  const activeName = CATEGORIES.find((c) => c.id === active)?.name;

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-12 md:px-6 md:py-16 desk:px-8 wide:px-12">
      <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Our Menu</p>
      <h1 className="mt-2 font-display text-[32px] leading-tight font-extrabold tracking-[-0.8px] text-ink md:text-[40px]">
        {activeName ?? "Full Menu"}
      </h1>

      <nav aria-label="Menu categories" className="-mx-4 mt-6 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex gap-2 pb-1">
          {FILTERS.map((filter) => {
            const selected = filter.id === active;
            return (
              <li key={filter.name}>
                <Link
                  to={filter.id ? `/menu?category=${filter.id}` : "/menu"}
                  aria-current={selected ? "true" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full border px-4 text-[14px] font-medium whitespace-nowrap transition-colors ${
                    selected ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink/30"
                  }`}
                >
                  {filter.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ul className="mt-8 grid grid-cols-1 gap-3 xs:grid-cols-2 md:gap-4 md:grid-cols-3 lg:grid-cols-4 desk:grid-cols-5">
        {products.map((product) => (
          <li key={product.id} className="flex [&>article]:flex-1">
            <ProductCard product={product} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </main>
  );
}
