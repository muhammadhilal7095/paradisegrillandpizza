import { Bike, Clock, ShoppingBag } from "lucide-react";
import { heroImage, type MenuCategory } from "../../data/menu";
import { PageHero } from "../ui/PageHero";

const PERKS = [
  { icon: Clock, text: "Made fresh to order" },
  { icon: ShoppingBag, text: "Collection" },
  { icon: Bike, text: "Delivery" },
];

/** Compact menu header: the full menu, or one category when `category` is given. */
export function MenuHero({ category, dishCount, categoryCount }: { category?: MenuCategory; dishCount?: number; categoryCount?: number }) {
  const summary =
    dishCount && categoryCount
      ? `${dishCount} ${dishCount === 1 ? "dish" : "dishes"} across ${categoryCount} ${categoryCount === 1 ? "category" : "categories"}, cooked fresh when you order.`
      : "Freshly prepared food, cooked when you order, for collection or delivery.";
  return (
    <PageHero
      titleId="menu-title"
      eyebrow={category ? "Our Menu" : "Order Online"}
      titleTop={category ? "Our" : "Our"}
      titleBottom={category ? category.name : "Menu"}
      description={category ? category.intro : summary}
      image={category ? heroImage(category.hero, category.heroAlt) : heroImage("menu", "Platter of grilled food with dips")}
    >
      <ul className="mt-6 flex flex-wrap gap-2">
        {PERKS.map(({ icon: Icon, text }) => (
          <li key={text} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm">
            <Icon size={14} strokeWidth={2} aria-hidden="true" className="text-brand" />
            {text}
          </li>
        ))}
      </ul>
    </PageHero>
  );
}
