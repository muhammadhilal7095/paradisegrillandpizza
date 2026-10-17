import type { ComponentType } from "react";
import { CookingPot, CupSoda, Droplet, Drumstick, Fish, Flame, Hamburger, LayoutGrid, Pizza, Sandwich, UsersRound, Wheat, type LucideProps } from "lucide-react";
import { GALLERY_CATEGORIES, type GalleryCategoryId } from "../../data/gallery";
import { Fries } from "../menu/categoryIcons";

const ICONS: Record<GalleryCategoryId | "all", ComponentType<LucideProps>> = {
  all: LayoutGrid,
  pizza: Pizza,
  "family-deals": UsersRound,
  chicken: Drumstick,
  "chicken-meals": CupSoda,
  "hot-wings": Flame,
  nuggets: Drumstick,
  "peri-burger-meal": Flame,
  "lamb-doner": Sandwich,
  kebabs: Sandwich,
  burgers: Hamburger,
  curries: CookingPot,
  naan: Wheat,
  fish: Fish,
  dips: Droplet,
  drinks: CupSoda,
  starters: Fries,
};

const FILTERS = [{ id: "all" as const, label: "All" }, ...GALLERY_CATEGORIES];

interface GalleryFiltersProps {
  active: GalleryCategoryId | "all";
  onChange: (id: GalleryCategoryId | "all") => void;
}

/** Toggle buttons that filter the grid in place. Scrolls sideways on phones and tablets; wraps onto centred rows on laptops. */
export function GalleryFilters({ active, onChange }: GalleryFiltersProps) {
  return (
    <div className="border-b border-line bg-white">
      <div
        role="group"
        aria-label="Filter photos by category"
        className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:px-6 lg:flex-wrap lg:justify-center lg:overflow-visible desk:px-8 wide:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {FILTERS.map(({ id, label }) => {
          const Icon = ICONS[id];
          const selected = id === active;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={`group flex h-11 shrink-0 items-center gap-2 rounded-full border pr-4 pl-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 ${
                selected ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-ink/20"
              }`}
            >
              <span
                className={`inline-flex size-8 items-center justify-center rounded-full transition-colors ${
                  selected ? "bg-white/15" : "bg-mist"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
