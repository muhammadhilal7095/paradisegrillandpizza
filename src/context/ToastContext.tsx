import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

type Notify = (message: string) => void;

const ToastContext = createContext<Notify | null>(null);

/** One short status message at a time, announced politely to screen readers. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback<Notify>((message) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 desk:bottom-5"
      >
        {toast && (
          <p
            key={toast.id}
            className="flex items-center gap-2.5 rounded-full bg-ink py-2.5 pr-5 pl-2.5 text-[14px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(5,5,5,0.5)] motion-safe:animate-[toast-in_200ms_ease-out]"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand">
              <Check size={14} strokeWidth={2.6} aria-hidden="true" />
            </span>
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
