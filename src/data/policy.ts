/** Shared shapes for numbered policy pages (Terms & Conditions, Returns & Refunds). */

/** A paragraph, optionally ending with an internal link. */
export type PolicyParagraph = string | { text: string; link: { label: string; to: string } };

export interface PolicySection<IconKey extends string> {
  id: string;
  title: string;
  icon: IconKey;
  content: PolicyParagraph[];
  /** Renders the configured email/phone and a contact link under the text. */
  showContactDetails?: boolean;
}

export interface PolicyMeta {
  status: "draft" | "published";
  /** ISO date (YYYY-MM-DD) of the version on the page. Leave null until it is real. */
  lastUpdated: string | null;
}

/** Numbers (01, 02…) come from position, so reordering renumbers automatically. */
export const sectionNumber = (index: number) => String(index + 1).padStart(2, "0");
