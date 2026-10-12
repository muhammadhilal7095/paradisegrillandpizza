/** Red painted brush stroke placed behind promotional text. Decorative; stretches to its box. */
export function BrushStroke({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 170" preserveAspectRatio="none" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16 40c40-16 118-22 196-20s150-6 190 6c6 2 8 8 4 12-6 6 6 10 2 18-4 10 10 16 2 26-6 8 6 14-2 22s4 14-6 20c-60 18-160 24-250 20-46-2-90-2-128-12-8-2-10-8-4-12 6-6-6-10 0-18 5-7-8-13 0-21 6-7-7-14 0-21 4-5-8-12-4-20Z" />
      <path d="M40 22c60-8 130-10 200-6" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M70 156c70 6 160 4 250-6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M400 70c10 0 14 4 16 8M6 112c-4 4-5 8-4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
