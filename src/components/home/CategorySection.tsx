import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMenu } from "../../context/menuStore";
import { CategoryCard } from "../menu/CategoryCard";
import { MenuStatusNotice } from "../menu/MenuStatusNotice";
import { SectionHeading } from "../ui/SectionHeading";

const arrow =
  "inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white disabled:pointer-events-none disabled:opacity-35";

/** Categories in one horizontal row: swipe on touch screens, arrow buttons on larger screens. */
export function CategorySection() {
  const { status, categories } = useMenu();
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  // Disable an arrow when the row is already at that end (or everything fits).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 });
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [categories]);

  /** Scrolls by most of a screenful, so the next set of tiles comes into view. */
  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  const scrollable = !(edges.start && edges.end);

  return (
    <section aria-labelledby="categories-title" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            id="categories-title"
            eyebrow="Our Menu"
            title={
              <>
                Something for <em>Every Craving</em>
              </>
            }
            description="Pick a category and start your order."
            widthClass="max-w-2xl"
          />
          {scrollable && (
            <div className="hidden shrink-0 gap-2 md:flex">
              <button type="button" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Previous categories" aria-controls="category-row" className={arrow}>
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => scrollBy(1)} disabled={edges.end} aria-label="More categories" aria-controls="category-row" className={arrow}>
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {status !== "ready" && (
          <div className="mt-10">
            <MenuStatusNotice skeletonCount={4} />
          </div>
        )}

        {/* On phones and tablets the row bleeds to the screen edge so the next tile peeks in, hinting it scrolls. */}
        <ul
          ref={trackRef}
          id="category-row"
          className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] empty:hidden md:-mx-6 md:scroll-px-6 md:gap-5 md:px-6 desk:mx-0 desk:scroll-px-0 desk:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <li
              key={category.id}
              className="w-[42%] shrink-0 snap-start xs:w-[40%] md:w-[calc((100%-3*1.25rem)/3.4)] lg:w-[calc((100%-4*1.25rem)/4.4)] desk:w-[calc((100%-4*1.25rem)/5)]"
            >
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
