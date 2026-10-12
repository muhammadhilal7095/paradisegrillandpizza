import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

/** Transparent, icon-only control with a 40px hit area. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, className = "", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:text-brand aria-expanded:text-brand ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});
