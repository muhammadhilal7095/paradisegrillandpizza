import { useLocation } from "react-router-dom";
import { BRAND } from "../config/site";
import { WHATSAPP_NUMBER } from "../config/ordering";
import { useCart } from "../context/CartContext";
import { WhatsAppIcon } from "./cart/WhatsAppIcon";

/**
 * Floating WhatsApp chat button, bottom-right on every page. Sits above the phone basket bar on
 * the menu page, and is hidden on checkout (which has its own WhatsApp ordering button).
 */
export function WhatsAppButton() {
  const { pathname } = useLocation();
  const { quantity } = useCart();
  if (!WHATSAPP_NUMBER || pathname.startsWith("/checkout")) return null;

  const raised = quantity > 0 && pathname.startsWith("/menu");
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello ${BRAND.name}, I have a question.`)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className={`group fixed right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_30px_-8px_rgba(18,140,75,0.7)] transition-[transform,bottom] duration-200 hover:scale-105 print:hidden md:right-6 ${
        raised ? "bottom-24 desk:bottom-6" : "bottom-4 md:bottom-6"
      }`}
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30 motion-reduce:hidden" />
      <WhatsAppIcon className="size-7" />
      <span className="hidden pr-1 text-[14px] font-semibold whitespace-nowrap desk:group-hover:inline">Chat with us</span>
    </a>
  );
}
