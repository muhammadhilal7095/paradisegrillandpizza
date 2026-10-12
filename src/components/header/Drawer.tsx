import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

interface DrawerProps {
  id: string;
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  closeLabel: string;
  heading: ReactNode;
  children: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Right-hand modal drawer with a subtle overlay. Focus moves inside on open,
 * Tab cycles within it while open, and it is `inert` while closed.
 */
export function Drawer({ id, open, onClose, label, closeLabel, heading, children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? "visible" : "invisible delay-300"}`} inert={!open}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={`absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-white shadow-[0_0_24px_rgba(17,17,17,0.08)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line pr-2 pl-5 md:h-16">
          {heading}
          <IconButton ref={closeRef} label={closeLabel} onClick={onClose}>
            <X size={22} strokeWidth={1.9} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
