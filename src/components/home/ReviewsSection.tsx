import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { REVIEW_SUMMARY, REVIEWS, type Review } from "../../data/reviews";
import { SectionHeading } from "../ui/SectionHeading";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          className={i < rating ? "fill-amber-400 text-amber-400" : "fill-white/15 text-white/15"}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <figure className="flex h-full gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand font-display text-[15px] font-bold text-white"
      >
        {initials}
      </span>
      <div>
        <figcaption className="text-[14px] font-semibold text-white">{review.name}</figcaption>
        <div className="mt-1">
          <Stars rating={review.rating} />
        </div>
        <blockquote className="mt-3 text-[13px] leading-relaxed text-white/75">“{review.text}”</blockquote>
      </div>
    </figure>
  );
}

const arrowButton =
  "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-deep text-white transition-colors hover:border-brand hover:bg-brand md:flex";

export function ReviewsSection() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  // Pages follow how many cards fit: 1 on phones, 2 on tablets, 3 on desktop.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setPageCount(Math.max(1, Math.round(track.scrollWidth / track.clientWidth)));
      setPage(Math.round(track.scrollLeft / track.clientWidth));
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const goTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const wrapped = (target + pageCount) % pageCount;
    track.scrollTo({ left: wrapped * track.clientWidth, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="reviews-title" className="bg-deep py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="reviews-title"
            tone="dark"
            widthClass="max-w-3xl"
            eyebrow="What Our Customers Say"
            title={
              <>
                Real Reviews. <em>Real Food Lovers.</em>
              </>
            }
            description="Our customers love our food. Here's what they say about us."
          />
          <div className="md:text-right">
            <div className="flex items-center gap-2 md:justify-end">
              <Stars rating={5} size={18} />
              <span className="font-display text-[18px] font-bold text-white">{REVIEW_SUMMARY.average}/5</span>
            </div>
            <p className="mt-1 text-[12px] text-white/60">Based on {REVIEW_SUMMARY.count} reviews</p>
          </div>
        </div>

        <div className="relative mt-10 md:px-14">
          <button type="button" onClick={() => goTo(page - 1)} aria-label="Previous reviews" className={`${arrowButton} left-0`}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <ul
            ref={trackRef}
            className="-mx-2 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {REVIEWS.map((review) => (
              <li key={review.id} className="w-full shrink-0 snap-start px-2 md:w-1/2 lg:w-1/3">
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => goTo(page + 1)} aria-label="Next reviews" className={`${arrowButton} right-0`}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        {pageCount > 1 && (
          <div className="mt-7 flex justify-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show review page ${i + 1}`}
                aria-current={i === page}
                className="flex size-6 items-center justify-center"
              >
                <span className={`block size-2 rounded-full transition-colors ${i === page ? "bg-brand" : "bg-white/30"}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
