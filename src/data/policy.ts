/** Shared shapes for the legal pages (Privacy, Return, Refund, Terms). */

/** A paragraph, optionally ending with an internal link. */
export type PolicyParagraph = string | { text: string; link: { label: string; to: string } };

/** Icon names for policy sections (kept in the data for future use; the current layout shows numbers). */
export type PolicyIcon =
  | "file"
  | "user"
  | "bag"
  | "card"
  | "wallet"
  | "clipboard"
  | "truck"
  | "utensils"
  | "alert"
  | "ban"
  | "refresh"
  | "x"
  | "scale"
  | "shield"
  | "lock"
  | "globe"
  | "clock"
  | "share"
  | "cookie"
  | "copyright"
  | "mail"
  | "message"
  | "cloud";

export interface PolicySection<IconKey extends string = PolicyIcon> {
  id: string;
  title: string;
  icon: IconKey;
  content: PolicyParagraph[];
  /** Optional bullet list shown after the paragraphs. */
  bullets?: string[];
  /** Renders the configured email/phone and a contact link under the text. */
  showContactDetails?: boolean;
}

export interface PolicyMeta {
  status: "draft" | "published";
  /** ISO date (YYYY-MM-DD) of the version on the page. Leave null until it is real. */
  lastUpdated: string | null;
}

/** One complete legal page. */
export interface PolicyDocument {
  meta: PolicyMeta;
  /** "At a glance" key points shown above the sections. */
  summary: string[];
  sections: readonly PolicySection[];
}

/** Numbers (01, 02…) come from position, so reordering renumbers automatically. */
export const sectionNumber = (index: number) => String(index + 1).padStart(2, "0");
