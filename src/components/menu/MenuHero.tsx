export function MenuHero() {
  return (
    <section aria-labelledby="menu-title" className="relative isolate flex flex-col overflow-hidden bg-deep md:block">
      <div className="relative order-2 aspect-[16/9] md:absolute md:inset-0 md:aspect-auto">
        <img
          src="/images/menu-hero-1920.webp"
          srcSet="/images/menu-hero-960.webp 960w, /images/menu-hero-1920.webp 1920w"
          sizes="100vw"
          width={1920}
          height={640}
          alt="Cheeseburger with lettuce, tomato and melted cheese against a dark background"
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-[75%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,rgba(5,5,5,0)_40%)] md:bg-[linear-gradient(90deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.85)_34%,rgba(5,5,5,0.1)_64%,rgba(5,5,5,0)_100%)]"
        />
      </div>

      <div className="relative order-1 mx-auto flex w-full max-w-[1400px] items-center px-4 pt-10 pb-6 md:min-h-[300px] md:px-6 md:py-14 desk:min-h-[340px] desk:px-8 wide:px-12">
        <div className="max-w-[420px]">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-brand uppercase">Our Menu</p>
          <h1
            id="menu-title"
            className="mt-3 font-display text-[36px] leading-[1.05] font-extrabold tracking-[-1px] md:text-[42px] desk:text-[48px]"
          >
            <span className="block text-white">Good Food</span>
            <span className="block text-brand">Great Choices</span>
          </h1>
          <p className="mt-4 max-w-[380px] text-[14px] leading-relaxed text-white/80 desk:text-[15px]">
            From juicy burgers to crispy fries, we've got something for every craving. Fresh ingredients. Bold flavours.
          </p>
          <span aria-hidden="true" className="mt-6 block h-1 w-14 rounded-full bg-brand" />
        </div>
      </div>
    </section>
  );
}
