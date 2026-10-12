import { CATEGORIES } from "../../data/menu";
import { CategoryCard } from "../menu/CategoryCard";
import { SectionHeading } from "../ui/SectionHeading";

export function CategorySection() {
  return (
    <section aria-labelledby="categories-title" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 desk:px-8 wide:px-12">
        <SectionHeading
          id="categories-title"
          align="center"
          eyebrow="Our Categories"
          title="Explore Our Menu"
          description="Choose from a variety of fresh, tasty and high-quality meals, made just for you."
        />
        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-x-6 lg:grid-cols-6 lg:gap-x-4">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
