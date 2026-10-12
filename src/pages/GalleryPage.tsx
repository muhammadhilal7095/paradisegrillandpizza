import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ImageOff } from "lucide-react";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { GalleryFilters } from "../components/gallery/GalleryFilters";
import { GalleryLightbox } from "../components/gallery/GalleryLightbox";
import { GalleryPromoBanner } from "../components/gallery/GalleryPromoBanner";
import { buttonClasses } from "../components/ui/button";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ORDER_PATH } from "../config/site";
import {
  GALLERY_INITIAL_COUNT,
  GALLERY_ITEMS,
  galleryCategoryLabel,
  isGalleryCategory,
  type GalleryCategoryId,
} from "../data/gallery";

export function GalleryPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("category");
  const active: GalleryCategoryId | "all" = isGalleryCategory(raw) ? raw : "all";

  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const matching = useMemo(
    () => (active === "all" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === active)),
    [active],
  );
  const limited = active === "all" && !expanded && matching.length > GALLERY_INITIAL_COUNT;
  const visible = limited ? matching.slice(0, GALLERY_INITIAL_COUNT) : matching;

  const setFilter = (id: GalleryCategoryId | "all") => {
    setOpenIndex(null);
    setParams(id === "all" ? {} : { category: id }, { replace: true });
  };

  const showMore = () => {
    setExpanded(true);
    // Move focus to the first newly revealed photo.
    requestAnimationFrame(() => cardRefs.current[GALLERY_INITIAL_COUNT]?.focus());
  };

  const closeLightbox = () => {
    const index = openIndex;
    setOpenIndex(null);
    if (index !== null) requestAnimationFrame(() => cardRefs.current[index]?.focus());
  };

  const status =
    active === "all"
      ? `Showing ${visible.length} of ${matching.length} photos`
      : `Showing ${matching.length} ${galleryCategoryLabel(active)} photo${matching.length === 1 ? "" : "s"}`;

  return (
    <main>
      <PageHero
        titleId="gallery-title"
        eyebrow="Our Gallery"
        titleTop="Moments"
        titleBottom="That Taste Amazing"
        description="A visual journey of our fresh ingredients, delicious meals and happy moments at BurgerBite."
        image={{
          small: "/images/gallery-hero-960.webp",
          large: "/images/gallery-hero-1920.webp",
          width: 1920,
          height: 700,
          alt: "Stacked burger with melted cheese, lettuce and tomato on a dark background",
        }}
        annotation="Freshly Made Visuals"
      >
        <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-7")}>
          Order Now
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </PageHero>

      <GalleryFilters active={active} onChange={setFilter} />

      <section aria-labelledby="food-gallery-title" className="bg-white pt-10 pb-16 md:pt-12 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
          <SectionHeading
            id="food-gallery-title"
            align="center"
            eyebrow="Our Food Gallery"
            title={
              <>
                A Taste of <em>Happiness</em>
              </>
            }
            description="Explore our freshly made meals, delicious combos and special moments."
          />
          <p role="status" className="sr-only">
            {status}
          </p>

          {visible.length > 0 ? (
            <ul className="mt-8 grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-3 md:gap-2.5">
              {visible.map((item, i) => (
                <li key={item.id}>
                  <GalleryCard
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    item={item}
                    eager={i < 3}
                    onOpen={() => setOpenIndex(i)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-line bg-mist px-6 py-12 text-center">
              <ImageOff size={28} strokeWidth={1.8} aria-hidden="true" className="text-muted" />
              <p className="mt-3 font-display text-[16px] font-bold text-ink">No photos here yet</p>
              <p className="mt-1 text-[13px] text-muted">We're adding more soon. In the meantime, browse everything.</p>
              <button type="button" onClick={() => setFilter("all")} className={buttonClasses("outlineDark", "sm", "mt-4 bg-white")}>
                Show all photos
              </button>
            </div>
          )}

          {limited && (
            <div className="mt-8 flex justify-center">
              <button type="button" onClick={showMore} className={buttonClasses("outlineDark", "md")}>
                Show more photos ({matching.length - visible.length})
              </button>
            </div>
          )}
        </div>
      </section>

      <GalleryPromoBanner />

      {openIndex !== null && visible[openIndex] && (
        <GalleryLightbox items={visible} index={openIndex} onIndexChange={setOpenIndex} onClose={closeLightbox} />
      )}
    </main>
  );
}
