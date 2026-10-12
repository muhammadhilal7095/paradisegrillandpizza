import type { SocialNetwork } from "../../config/site";

/** Outline brand glyphs drawn to match Lucide's 24px / 1.8 stroke style (Lucide ships no brand icons). */
const PATHS: Record<SocialNetwork, React.ReactNode> = {
  facebook: <path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />,
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  tiktok: (
    <>
      <path d="M15.5 3v11.6a4.4 4.4 0 1 1-4.4-4.4" />
      <path d="M15.5 3c0 2.9 2.2 5.1 5 5.1" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3Z" />
    </>
  ),
};

export function SocialIcon({ network, size = 18 }: { network: SocialNetwork; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[network]}
    </svg>
  );
}
