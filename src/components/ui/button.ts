type Variant = "primary" | "outlineLight" | "outlineDark";
type Size = "xs" | "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  outlineLight: "border border-white/60 text-white hover:border-white hover:bg-white hover:text-ink",
  outlineDark: "border border-ink/15 text-ink hover:border-ink",
};

const SIZES: Record<Size, string> = {
  xs: "h-8 gap-1 px-3 text-[12px]",
  sm: "h-9 gap-1.5 px-4 text-[13px]",
  md: "h-11 gap-2 px-6 text-[14px]",
};

/** Shared pill-button styling for <button> and <Link>. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}
