import { useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Phone, X } from "lucide-react";
import { CONTACT, formatTime, telHref, todaysHours } from "../config/contact";
import { BRAND } from "../config/site";
import { WHATSAPP_NUMBER } from "../config/ordering";
import { useCart } from "../context/CartContext";
import { WhatsAppIcon } from "./cart/WhatsAppIcon";

/** "Open now" / "Closed now · opens …" from today's opening hours. */
function openStatus(now = new Date()) {
  const today = todaysHours(now);
  if (!today?.open || !today.close || today.closed) return { open: false, label: "Closed today" };
  const mins = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = today.open.split(":").map(Number);
  const [ch, cm] = today.close.split(":").map(Number);
  const close = ch * 60 + cm || 24 * 60; // "00:00" closes at midnight
  if (mins >= oh * 60 + om && mins < close) return { open: true, label: `Open now until ${formatTime(today.close)} · fast replies` };
  return { open: false, label: `Closed now · opens ${formatTime(today.open)}${mins < oh * 60 + om ? " today" : " tomorrow"}` };
}

/**
 * Floating WhatsApp button, bottom-right on every page. It opens a small card with "Message on WhatsApp",
 * "Call on WhatsApp" and "Call now". It sits above the phone basket bar on the menu page and is hidden
 * on checkout (which has its own WhatsApp ordering button).
 */
export function WhatsAppButton() {
  const { pathname } = useLocation();
  const { quantity } = useCart();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstActionRef = useRef<HTMLAnchorElement>(null);

  // Close on Escape or a click outside; move focus into the card when it opens.
  useEffect(() => {
    if (!open) return;
    firstActionRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Close when the page changes.
  useEffect(() => setOpen(false), [pathname]);

  if (!WHATSAPP_NUMBER || pathname.startsWith("/checkout")) return null;

  const raised = quantity > 0 && pathname.startsWith("/menu");
  const message = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello ${BRAND.name}, I'd like to place an order.`)}`;
  const chat = `https://wa.me/${WHATSAPP_NUMBER}`;
  const phone = CONTACT.phones[0];
  const status = openStatus();

  return (
    <div ref={wrapRef} className={`fixed right-4 z-40 flex flex-col items-end gap-3 print:hidden md:right-6 ${raised ? "bottom-24 desk:bottom-6" : "bottom-4 md:bottom-6"}`}>
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-[22px] border border-white/10 bg-[#111] text-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)] motion-safe:animate-[wa-pop_180ms_ease-out]"
        >
          <div className="flex items-center gap-3 border-b border-white/10 bg-[linear-gradient(135deg,rgba(224,48,30,0.28),transparent_70%)] px-5 py-4">
            <img src="/images/brand/logo-96.webp" alt="" width={48} height={48} className="size-12 shrink-0 rounded-full bg-white ring-2 ring-brand/60" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-[17px] leading-tight font-bold">{BRAND.name}</p>
              <p className="mt-0.5 text-[12.5px] text-white/60">Pizza · Grill · Halal · Slough</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Close"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>

          <div className="px-5 pt-5 pb-5">
            <p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase">Collection &amp; delivery</p>
            <h2 id={titleId} className="mt-2 font-display text-[24px] leading-[1.15] font-extrabold">
              Order on WhatsApp or <span className="text-brand">Call Now</span>
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-white/70">
              Send us your order or any question. We'll confirm the total and start cooking straight away.
            </p>

            <a
              ref={firstActionRef}
              href={message}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex min-h-13 items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 text-[14px] font-bold tracking-[0.08em] text-white uppercase shadow-[0_10px_26px_-10px_rgba(37,211,102,0.8)] transition-colors hover:bg-[#1fbd5a]"
            >
              <WhatsAppIcon className="size-5" />
              Message on WhatsApp
            </a>
            <a
              href={chat}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex min-h-13 items-center justify-center gap-2.5 rounded-xl border border-[#25D366]/60 px-4 text-[14px] font-bold tracking-[0.08em] text-[#25D366] uppercase transition-colors hover:bg-[#25D366]/10"
            >
              <Phone size={18} strokeWidth={2.2} aria-hidden="true" className="fill-[#25D366]" />
              Call on WhatsApp
            </a>
            <p className="mt-2 text-center text-[12px] text-white/50">Opens our chat. Tap the call icon to ring us.</p>

            {phone && (
              <a
                href={telHref(phone)}
                className="mt-4 flex min-h-13 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 rounded-xl bg-white px-4 py-2 text-ink transition-colors hover:bg-white/90"
              >
                <span className="flex items-center gap-2 text-[14px] font-bold tracking-[0.08em] uppercase">
                  <Phone size={18} strokeWidth={2.2} aria-hidden="true" className="fill-brand text-brand" />
                  Call now
                </span>
                <span className="text-[14px] font-medium text-muted">{phone}</span>
              </a>
            )}

            <p className="mt-4 flex items-center gap-2 text-[13px] text-white/60">
              <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${status.open ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]" : "bg-white/30"}`} />
              {status.label}
            </p>
          </div>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close WhatsApp options" : "Order or chat on WhatsApp"}
        className="group relative flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_30px_-8px_rgba(18,140,75,0.7)] transition-transform duration-200 hover:scale-105"
      >
        {!open && <span aria-hidden="true" className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30 motion-reduce:hidden" />}
        {open ? <X className="size-7" strokeWidth={2.2} aria-hidden="true" /> : <WhatsAppIcon className="size-7" />}
        {!open && <span className="hidden pr-1 text-[14px] font-semibold whitespace-nowrap desk:group-hover:inline">Chat with us</span>}
      </button>
    </div>
  );
}
