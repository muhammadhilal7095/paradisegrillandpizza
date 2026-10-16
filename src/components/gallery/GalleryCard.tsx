import { forwardRef } from "react";
import { Maximize2 } from "lucide-react";
import { galleryCategoryLabel, galleryImage, type GalleryItem } from "../../data/gallery";

interface GalleryCardProps {
  item: GalleryItem;
  onOpen: () => void;
  /** First rows load eagerly; the rest are lazy. */
  eager?: boolean;
}

/** One photo tile. The whole tile is a button that opens the lightbox. */
export const GalleryCard = forwardRef<HTMLButtonElement, GalleryCardProps>(function GalleryCard({ item, onOpen, eager }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-mist"
    >
      <img
        src={galleryImage(item, 540)}
        srcSet={`${galleryImage(item, 540)} 540w, ${galleryImage(item, 1080)} 1080w`}
        sizes="(min-width: 768px) 33vw, (min-width: 375px) 50vw, 100vw"
        width={600}
        height={450}
        alt={item.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-deep/0 transition-colors duration-300 group-hover:bg-deep/45 group-focus-visible:bg-deep/45"
      />
      <span
        aria-hidden="true"
        className="absolute top-2.5 right-2.5 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Maximize2 size={15} strokeWidth={2} />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 p-3 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="block font-display text-[15px] leading-tight font-bold text-white">{item.title}</span>
        <span className="mt-0.5 block text-[12px] text-white/80">{galleryCategoryLabel(item.category)}</span>
      </span>
      <span className="sr-only">, open larger view</span>
    </button>
  );
});
