import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, X } from "lucide-react";
import { NAV_ITEMS } from "../../config/navigation";
import { IconButton } from "./IconButton";

export const SEARCH_PANEL_ID = "header-search";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

/** Compact search shown below the header. Searches the site's pages until a menu search exists. */
export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const resultsId = useId();

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q)) : NAV_ITEMS;
  }, [query]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim() && results[0]) {
      navigate(results[0].to);
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
            <span className="sr-only">Search BurgerBite</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages…"
              aria-controls={resultsId}
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
            />
          </label>
          <IconButton label="Close search" onClick={onClose}>
            <X size={21} strokeWidth={1.9} />
          </IconButton>
        </form>

        <div id={resultsId} aria-live="polite" className="mt-3">
          {results.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {results.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                  >
                    {item.label}
                    <ArrowRight size={14} strokeWidth={1.9} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-muted">No pages match “{query.trim()}”.</p>
          )}
        </div>
      </div>
    </div>
  );
}
