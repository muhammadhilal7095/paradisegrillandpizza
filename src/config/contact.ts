/**
 * Contact page configuration.
 *
 * Everything below is EXAMPLE data from the design brief. While CONTACT_DETAILS_VERIFIED is false:
 *  - details are shown as plain text (no tel:/mailto:/website links, so nobody calls or emails a stranger),
 *  - the map shows a labelled preview instead of a real location, and there is no Get Directions link,
 *  - a short "example details" note is shown to visitors.
 * Replace the values with Paradise Grill and Pizza's real details, then set the flag to true.
 */
export const CONTACT_DETAILS_VERIFIED = false;

export const CONTACT = {
  phones: ["+44 20 7946 0123"],
  emails: ["hello@paradisegrill.example"],
  address: {
    lines: ["12 High Street", "London, UK"],
    /** Map pin. Required for the embedded map once verified. */
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  },
  website: "https://www.paradisegrill.example",
};

export interface OpeningHours {
  days: string;
  /** 24-hour "HH:MM". "00:00" as a closing time means midnight. */
  open?: string;
  close?: string;
  closed?: boolean;
}

export const OPENING_HOURS: readonly OpeningHours[] = [
  { days: "Monday – Thursday", open: "12:00", close: "23:00" },
  { days: "Friday – Saturday", open: "12:00", close: "00:00" },
  { days: "Sunday", open: "13:00", close: "23:00" },
];

/**
 * Message form. Set VITE_CONTACT_ENDPOINT (e.g. a Formspree/Getform URL or your own API route)
 * in a .env file. The form POSTs JSON: { name, email, subject, message }.
 * Without an endpoint the form validates but tells the visitor it can't send yet — it never fakes success.
 * Never put secret API keys here; anything in VITE_* ends up in the browser.
 */
export const CONTACT_FORM = {
  endpoint: (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim() || "",
  successTitle: "Thank you for contacting Paradise Grill and Pizza!",
  successMessage: "Your message has been received. We'll get back to you as soon as possible.",
  errorMessage: "Sorry, your message couldn't be sent. Please check your connection and try again.",
  notConfiguredMessage:
    "Our message service isn't connected yet, so this form can't send messages right now. Your message is still here — please try again later.",
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** "23:00" → "11:00 PM"; "00:00" → "12:00 AM". */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Day indexes (0 = Sunday) covered by a row like "Monday – Thursday" or "Sunday". */
function rowDays(days: string) {
  const [from, to = from] = days.split(/[–-]/).map((d) => DAY_NAMES.indexOf(d.trim()));
  if (from < 0 || to < 0) return [];
  const result: number[] = [];
  for (let d = from; ; d = (d + 1) % 7) {
    result.push(d);
    if (d === to) break;
  }
  return result;
}

/** Today's opening hours row, if the table covers today. */
export const todaysHours = (now = new Date()) => OPENING_HOURS.find((row) => rowDays(row.days).includes(now.getDay()));
