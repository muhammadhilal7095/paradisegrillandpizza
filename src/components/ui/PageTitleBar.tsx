import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface PageTitleBarProps {
  title: string;
  /** Trail before the current page, e.g. [{ label: "Cart", to: "/cart" }]. Home is added automatically. */
  trail?: { label: string; to: string }[];
  description?: string;
}

/** Slim dark heading band for task pages (cart, checkout) where a photo hero would get in the way. */
export function PageTitleBar({ title, trail = [], description }: PageTitleBarProps) {
  return (
    <div className="bg-deep text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6 md:py-10 desk:px-8 wide:px-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-[13px] text-white/60">
            {[{ label: "Home", to: "/" }, ...trail].map((crumb) => (
              <li key={crumb.to} className="flex items-center gap-1">
                <Link to={crumb.to} className="inline-flex min-h-8 items-center transition-colors hover:text-white">
                  {crumb.label}
                </Link>
                <ChevronRight size={14} aria-hidden="true" />
              </li>
            ))}
            <li aria-current="page" className="text-white">
              {title}
            </li>
          </ol>
        </nav>
        <h1 className="mt-2 font-display text-[30px] leading-tight font-bold tracking-[-0.5px] md:text-[38px]">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-[14px] text-white/75 md:text-[15px]">{description}</p>}
      </div>
    </div>
  );
}
