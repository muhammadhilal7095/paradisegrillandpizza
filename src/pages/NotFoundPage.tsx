import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "../components/ui/button";
import { useMenu } from "../context/menuStore";

export function NotFoundPage() {
  const { categories } = useMenu();
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center md:py-28">
      <p className="font-display text-[64px] leading-none font-extrabold text-brand">404</p>
      <h1 className="mt-4 font-display text-[28px] font-bold text-ink md:text-[34px]">We couldn't find that page</h1>
      <p className="mt-3 text-[15px] text-muted">The link may be old or mistyped. Try the menu instead. There's plenty to choose from.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/menu" className={buttonClasses("primary", "md")}>
          View the menu
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
        <Link to="/" className={buttonClasses("outlineDark", "md")}>
          Back to home
        </Link>
      </div>
      <ul className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[14px]" aria-label="Menu categories">
        {categories.map((c) => (
          <li key={c.id}>
            <Link to={`/menu/${c.id}`} className="inline-flex min-h-10 items-center text-brand-dark hover:text-ink">
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
