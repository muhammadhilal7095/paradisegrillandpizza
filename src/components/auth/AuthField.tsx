import { forwardRef, useId, useState, type ComponentType, type InputHTMLAttributes } from "react";
import { CircleAlert, Eye, EyeOff, type LucideProps } from "lucide-react";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  icon: ComponentType<LucideProps>;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
}

/** Labelled input with icon, inline error (icon + text, linked via aria-describedby) and a show/hide toggle for passwords. */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, icon: Icon, value, onValueChange, error, hint, optional, type = "text", className = "", ...rest },
  ref,
) {
  const uid = useId();
  const id = rest.id ?? uid;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const isPassword = type === "password";
  const [reveal, setReveal] = useState(false);
  const describedBy = [error ? errorId : "", hint ? hintId : ""].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-ink">
        <span>
          {label}
          {!optional && (
            <>
              {" "}
              <span aria-hidden="true" className="text-brand-dark">*</span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </span>
        {optional && <span className="text-[12px] font-normal text-muted">Optional</span>}
      </label>
      <div className="relative">
        <Icon size={17} strokeWidth={1.8} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
        <input
          ref={ref}
          id={id}
          type={isPassword && reveal ? "text" : type}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={optional ? undefined : true}
          className={`h-11 w-full rounded-xl border bg-white pl-10 text-[14px] text-ink placeholder:text-muted/80 transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none disabled:bg-mist ${
            isPassword ? "pr-11" : "pr-3.5"
          } ${error ? "border-brand-dark" : "border-line hover:border-ink/20"}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Hide password" : "Show password"}
            aria-pressed={reveal}
            className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
          >
            {reveal ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[12px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-[12px] font-medium text-brand-dark">
          <CircleAlert size={14} strokeWidth={2.2} aria-hidden="true" className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});
