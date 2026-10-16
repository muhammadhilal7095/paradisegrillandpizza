import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryCategoryLabel, galleryImage, type GalleryItem } from "../../data/gallery";

interface GalleryLightboxProps {
  items: readonly GalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_PX = 50;
const FOCUSABLE = "button:not([disabled])";

/**
 * Full-screen photo viewer: ←/→ or swipe to move, Esc to close.
 * Focus stays inside while open; the caller restores it to the tile on close.
 */
export function GalleryLightbox({ items, index, onIndexChange, onClose }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const item = items[index];
  const many = items.length > 1;

  const go = (step: number) => onIndexChange((index + step + items.length) % items.length);

  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // If focus ever lands outside (e.g. browser chrome round-trip), pull it back in.
    const keepFocusInside = (event: FocusEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) closeRef.current?.focus();
    };
    document.addEventListener("focusin", keepFocusInside);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("focusin", keepFocusInside);
    };
  }, []);

  // Warm the cache for the neighbours so arrowing feels instant.
  useEffect(() => {
    if (!many) return;
    for (const step of [-1, 1]) {
      const next = items[(index + step + items.length) % items.length];
      new Image().src = galleryImage(next, 1080);
    }
  }, [index, items, many]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    } else if (event.key === "ArrowLeft" && many) {
      go(-1);
    } else if (event.key === "ArrowRight" && many) {
      go(1);
    } else if (event.key === "Tab" && dialogRef.current) {
      const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = els[0];
      const last = els[els.length - 1];
      const onDialog = document.activeElement === dialogRef.current;
      if (event.shiftKey && (onDialog || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (onDialog || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null || !many) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
  };

  const navButton =
    "absolute top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      // Focusable so clicks/swipes on the photo keep focus (and arrow keys) inside the dialog.
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex flex-col bg-deep/95 text-white outline-none motion-safe:animate-[toast-in_200ms_ease-out]"
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-4 md:px-6">
        <p className="text-[13px] text-white/70 tabular-nums" aria-hidden={!many}>
          {many && `${index + 1} / ${items.length}`}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="inline-flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
        >
          <X size={24} strokeWidth={1.9} />
        </button>
      </div>

      <figure className="relative flex min-h-0 flex-1 flex-col items-center px-4 pb-5 md:px-20">
        <div
          className="flex min-h-0 w-full flex-1 touch-pan-y items-center justify-center select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <img
            key={item.id}
            src={galleryImage(item, 1080)}
            width={1200}
            height={900}
            alt={item.alt}
            draggable={false}
            className="max-h-full max-w-full rounded-md object-contain motion-safe:animate-[toast-in_200ms_ease-out]"
          />
        </div>
        {many && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${navButton} left-2 md:left-5`}>
              <ChevronLeft size={24} strokeWidth={2} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${navButton} right-2 md:right-5`}>
              <ChevronRight size={24} strokeWidth={2} />
            </button>
          </>
        )}
        <figcaption aria-live="polite" className="mt-4 text-center">
          <h2 id="lightbox-title" className="font-display text-[18px] font-bold">
            {item.title}
          </h2>
          <p className="mt-1 text-[13px] text-white/70">
            {galleryCategoryLabel(item.category)}
            {item.description && ` · ${item.description}`}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
