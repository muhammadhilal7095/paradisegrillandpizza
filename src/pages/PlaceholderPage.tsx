interface PlaceholderPageProps {
  title: string;
}

/** Minimal route target until each page's real content is built. */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 desk:px-8 wide:px-12">
      <h1 className="font-display text-[32px] font-extrabold tracking-[-0.8px] text-ink md:text-[40px]">{title}</h1>
      <p className="mt-3 text-[15px] text-muted">This page is coming soon.</p>
    </main>
  );
}
