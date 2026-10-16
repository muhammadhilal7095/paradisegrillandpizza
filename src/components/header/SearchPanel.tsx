import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, X } from "lucide-react";
import { NAV_ITEMS } from "../../config/navigation";
import { useMenu } from "../../context/menuStore";
import { formatPrice } from "../../data/menu";
import { IconButton } from "./IconButton";

export const SEARCH_PANEL_ID = "header-search";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

const chip =
  "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-brand hover:text-brand";

/** Compact search below the header: matches menu items by name/description, plus site pages. */
export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const resultsId = useId();
  const { products: menuProducts } = useMenu();

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery("");
  }, [open]);

  const q = query.trim().toLowerCase();
  const { products, pages } = useMemo(
    () => ({
      products: q
        ? menuProducts.filter((p) => `${p.name} ${p.description ?? ""} ${p.category}`.toLowerCase().includes(q)).map((p) => ({
            key: p.id,
            label: p.name,
            detail: formatPrice(p.price),
            to: `/menu/${p.category}#${p.id}`,
          }))
        : [],
      pages: (q ? NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q)) : NAV_ITEMS).map((item) => ({
        key: item.to,
        label: item.label,
        to: item.to,
      })),
    }),
    [q, menuProducts],
  );

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const first = products[0] ?? pages[0];
    if (q && first) {
      navigate(first.to);
      onClose();
    }
  };

  return (
    <div
      id={SEARCH_PANEL_ID}
      className="absolute inset-x-0 top-full border-b border-line bg-white shadow-[0_12px_24px_-16px_rgba(17,17,17,0.18)]"
    >
      <div className="mx-auto max-w-[1400px] px-3 py-4 xs:px-4 md:px-6 desk:px-8 wide:px-12">
        <form role="search" onSubmit={handleSubmit} className="flex items-center gap-2">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-full border border-line bg-mist px-4 focus-within:border-ink/30">
            <Search size={18} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-muted" />
            <span className="sr-only">Search the menu and pages</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pizza, peri peri, kebabs…"
              aria-controls={resultsId}
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
            />
          </label>
          <IconButton label="Close search" onClick={onClose}>
            <X size={21} strokeWidth={1.9} />
          </IconButton>
        </form>

        <div id={resultsId} aria-live="polite" className="mt-3 flex flex-col gap-3">
          {products.length > 0 && (
            <ResultGroup title="Menu">
              {products.map((r) => (
                <li key={r.key}>
                  <Link to={r.to} onClick={onClose} className={chip}>
                    {r.label}
                    <span className="text-muted">· {r.detail}</span>
                  </Link>
                </li>
              ))}
            </ResultGroup>
          )}
          {pages.length > 0 && (
            <ResultGroup title="Pages">
              {pages.map((r) => (
                <li key={r.key}>
                  <Link to={r.to} onClick={onClose} className={chip}>
                    {r.label}
                    <ArrowRight size={14} strokeWidth={1.9} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ResultGroup>
          )}
          {products.length === 0 && pages.length === 0 && (
            <p className="text-[13px] text-muted">Nothing matches “{query.trim()}”.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-1.5 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">{title}</h2>
      <ul className="flex flex-wrap gap-2">{children}</ul>
    </div>
  );
}
