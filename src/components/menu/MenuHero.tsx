import { PageHero } from "../ui/PageHero";

export function MenuHero() {
  return (
    <PageHero
      titleId="menu-title"
      eyebrow="Our Menu"
      titleTop="Good Food"
      titleBottom="Great Choices"
      description="From juicy burgers to crispy fries, we've got something for every craving. Fresh ingredients. Bold flavours."
      image={{
        small: "/images/menu-hero-960.webp",
        large: "/images/menu-hero-1920.webp",
        width: 1920,
        height: 640,
        alt: "Cheeseburger with lettuce, tomato and melted cheese against a dark background",
      }}
    >
      <span aria-hidden="true" className="mt-6 block h-1 w-14 rounded-full bg-brand" />
    </PageHero>
  );
}
