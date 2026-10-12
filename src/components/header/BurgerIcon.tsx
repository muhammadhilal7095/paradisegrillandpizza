interface BurgerIconProps {
  className?: string;
}

/** BurgerBite mark — a single-colour vector burger that inherits `currentColor`. */
export function BurgerIcon({ className }: BurgerIconProps) {
  return (
    <svg viewBox="0 0 44 40" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      {/* Top bun */}
      <path d="M4 16.6C4 9.1 12 4 22 4s18 5.1 18 12.6c0 1-.8 1.9-1.9 1.9H5.9c-1.1 0-1.9-.9-1.9-1.9Z" />
      {/* Sesame seeds */}
      <g fill="#FFFFFF">
        <ellipse cx="14.5" cy="11" rx="1.6" ry="0.9" transform="rotate(-25 14.5 11)" />
        <ellipse cx="22" cy="8.4" rx="1.6" ry="0.9" />
        <ellipse cx="29.5" cy="11" rx="1.6" ry="0.9" transform="rotate(25 29.5 11)" />
      </g>
      {/* Lettuce */}
      <path
        d="M4.5 22.2q2.9-2.2 5.8 0t5.8 0 5.8 0 5.8 0 5.8 0 5.8 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Patty */}
      <rect x="3" y="25" width="38" height="4.4" rx="2.2" />
      {/* Bottom bun */}
      <path d="M5 31.4h34v1.3c0 2.4-2 4.3-4.4 4.3H9.4C7 37 5 35.1 5 32.7v-1.3Z" />
    </svg>
  );
}
