import { CircleAlert, CircleCheck, Info } from "lucide-react";

interface FormAlertProps {
  tone: "error" | "success" | "info";
  children: React.ReactNode;
}

const STYLES = {
  error: { box: "border-brand/25 bg-white text-brand-dark", Icon: CircleAlert },
  success: { box: "border-line bg-white text-ink", Icon: CircleCheck },
  info: { box: "border-line bg-mist text-soft", Icon: Info },
};

/** Inline message box. Errors use role="alert" so screen readers announce them immediately. */
export function FormAlert({ tone, children }: FormAlertProps) {
  const { box, Icon } = STYLES[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-[13px] ${box}`}>
      <Icon size={16} strokeWidth={2.2} aria-hidden="true" className={`mt-px shrink-0 ${tone === "success" ? "text-brand" : ""}`} />
      <div>{children}</div>
    </div>
  );
}
