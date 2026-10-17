/**
 * Contact details: the restaurant's real, confirmed details.
 *
 * With CONTACT_DETAILS_VERIFIED true the site shows tap-to-call / email links, the real map and
 * a Get Directions link. Opening hours below are still to be confirmed by the restaurant.
 */
export const CONTACT_DETAILS_VERIFIED = true;

export const CONTACT = {
  phones: ["+44 1753 371730"],
  emails: ["info@paradisegap.co.uk"],
  address: {
    lines: ["121 Bath Rd, Slough", "SL1 3UW, United Kingdom"],
    /** Map pin (Bath Road, SL1 3UW, from OpenStreetMap). */
    lat: 51.51263 as number | undefined,
    lng: -0.61279 as number | undefined,
  },
  website: "https://paradisegap.co.uk",
};

/** False until the restaurant confirms the opening hours below (a "to be confirmed" note shows until then). */
export const OPENING_HOURS_VERIFIED = false;

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
