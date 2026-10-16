import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { REVIEW_SUMMARY, REVIEWS, REVIEWS_VERIFIED, type Review } from "../../data/reviews";
import { SectionHeading } from "../ui/SectionHeading";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} aria-hidden="true" className={i < rating ? "fill-amber-400 text-amber-400" : "fill-line text-line"} />
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
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 md:p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">“{review.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-[13px] font-bold text-white">
          {initials}
        </span>
        <span className="text-[14px] font-semibold text-ink">{review.name}</span>
      </figcaption>
    </figure>
  );
}

const arrowButton =
  "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white md:flex";

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
    <section aria-labelledby="reviews-title" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="reviews-title"
            widthClass="max-w-3xl"
            eyebrow="Reviews"
            title={
              <>
                What Our <em>Customers Say</em>
              </>
            }
            description="Real food, cooked fresh. Here's what people say after their order."
          />
          {REVIEWS_VERIFIED ? (
            <div className="md:text-right">
              <div className="flex items-center gap-2 md:justify-end">
                <Stars rating={5} size={18} />
                <span className="font-display text-[18px] font-bold text-ink">{REVIEW_SUMMARY.average}/5</span>
              </div>
              <p className="mt-1 text-[12px] text-muted">Based on {REVIEW_SUMMARY.count} reviews</p>
            </div>
          ) : (
            <p className="text-[12px] text-muted">Sample reviews, to be replaced with real customer reviews.</p>
          )}
        </div>

        <div className="relative mt-10 md:px-14">
          <button type="button" onClick={() => goTo(page - 1)} aria-label="Previous reviews" className={`${arrowButton} left-0`}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <ul ref={trackRef} className="-mx-2 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          <div className="mt-7 flex justify-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show review page ${i + 1}`}
                aria-current={i === page}
                className="flex size-8 items-center justify-center"
              >
                <span className={`block h-2 rounded-full transition-all ${i === page ? "w-6 bg-brand" : "w-2 bg-silver"}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
