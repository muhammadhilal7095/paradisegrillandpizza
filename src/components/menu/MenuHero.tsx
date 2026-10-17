import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Bike, Clock, Phone, Tag, UtensilsCrossed } from "lucide-react";
import { CONTACT, telHref } from "../../config/contact";
import { useMenu } from "../../context/menuStore";
import { heroImage, type MenuCategory } from "../../data/menu";
import { buttonClasses } from "../ui/button";

interface MenuHeroProps {
  category?: MenuCategory;
  dishCount?: number;
  categoryCount?: number;
}

const FULL_MENU_IMAGE = heroImage("menu", "Crispy chicken burger with fries and ketchup on a dark background");

/**
 * Menu page banner: photo on the right with the copy on a dark fade (full width behind the copy
 * on laptops; a darker background on phones and tablets so the page gets to the food quickly).
 */
export function MenuHero({ category, dishCount = 0, categoryCount = 0 }: MenuHeroProps) {
  const { dealProducts } = useMenu();
  const image = category ? heroImage(category.hero, category.heroAlt) : FULL_MENU_IMAGE;
  const phone = CONTACT.phones[0];
  const count = category ? 0 : dishCount;

  const stats = [
    count > 0 && { icon: UtensilsCrossed, text: `${count} dishes` },
    !category && categoryCount > 0 && { icon: Tag, text: `${categoryCount} categories` },
    { icon: BadgeCheck, text: "Halal" },
    { icon: Clock, text: "Cooked to order" },
    category && { icon: Bike, text: "Collection & Delivery" },
  ].filter(Boolean) as { icon: typeof Tag; text: string }[];

  return (
    <section aria-labelledby="menu-title" className="relative isolate overflow-hidden bg-deep text-white">
      <img
        src={image.large}
        srcSet={`${image.small} 960w, ${image.large} 1920w`}
        sizes="100vw"
        width={1920}
        height={880}
        alt={image.alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-[65%_center] [filter:saturate(1.08)_contrast(1.05)] motion-safe:animate-[hero-zoom_14s_ease-out_both] desk:object-[80%_center]"
      />
      {/* Phones and tablets: an even dark wash. Laptops: dark only behind the copy. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.78),rgba(5,5,5,0.9))] desk:bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.94)_30%,rgba(5,5,5,0.45)_55%,rgba(5,5,5,0.05)_78%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_40%_70%_at_78%_55%,rgba(224,48,30,0.2),transparent_70%)] desk:block" />

      <div className="mx-auto flex max-w-[1400px] items-center px-4 py-10 md:px-6 md:py-14 desk:min-h-[440px] desk:px-8 desk:py-16 wide:px-12">
        <div className="max-w-[560px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.04em] backdrop-blur-sm">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            {category ? "Our Menu" : "Order Online · Collection & Delivery"}
          </p>

          <h1 id="menu-title" className="mt-4 font-display text-[38px] leading-[1.02] font-extrabold tracking-[-1px] md:text-[48px] desk:text-[58px] desk:tracking-[-1.6px]">
            {category ? (
              <span className="text-brand">{category.name}</span>
            ) : (
              <>
                <span className="block">Hungry?</span>
                <span className="block text-brand">Explore Our Menu.</span>
              </>
            )}
          </h1>

          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-white/80 md:text-[16px]">
            {category
              ? category.intro
              : "Pizza, burgers, crispy fried chicken, doner and more, all cooked fresh the moment you order. Pick a category below or search for your favourite."}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {stats.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[12px] font-medium text-white/90">
                <Icon size={14} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            {dealProducts.length > 0 && (
              <Link to="/offers" className={buttonClasses("primary", "md", "shadow-[0_12px_30px_-10px_rgba(224,48,30,0.8)]")}>
                See today's deals
                <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            )}
            {phone && (
              <a href={telHref(phone)} className="inline-flex min-h-10 items-center gap-2 text-[14px] text-white/75 transition-colors hover:text-white">
                <Phone size={15} strokeWidth={2.2} aria-hidden="true" className="text-brand" />
                Order by phone <span className="font-semibold text-white">{phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
