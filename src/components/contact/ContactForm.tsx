import { useEffect, useId, useRef, useState, type ComponentType, type FormEvent } from "react";
import { ArrowRight, CircleAlert, CircleCheck, LoaderCircle, Mail, MessageCircle, MessageSquare, UserRound, type LucideProps } from "lucide-react";
import { CONTACT_FORM } from "../../config/contact";
import { buttonClasses } from "../ui/button";

type FieldName = "name" | "email" | "subject" | "message";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: Values = { name: "", email: "", subject: "", message: "" };
const ORDER: FieldName[] = ["name", "email", "subject", "message"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!v.email.trim()) e.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address, like name@example.com.";
  if (!v.subject.trim()) e.subject = "Please add a subject.";
  if (!v.message.trim()) e.message = "Please write your message.";
  return e;
}

interface FieldProps {
  name: FieldName;
  label: string;
  placeholder: string;
  icon: ComponentType<LucideProps>;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  maxLength: number;
  value: string;
  error?: string;
  onChange: (name: FieldName, value: string) => void;
  onBlur: (name: FieldName) => void;
  inputRef: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
  className?: string;
}

function Field({ name, label, placeholder, icon: Icon, type = "text", autoComplete, multiline, maxLength, value, error, onChange, onBlur, inputRef, className = "" }: FieldProps) {
  const uid = useId();
  const id = `${uid}-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    placeholder,
    maxLength,
    autoComplete,
    "aria-required": true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (e: { target: { value: string } }) => onChange(name, e.target.value),
    onBlur: () => onBlur(name),
    className: `w-full rounded-xl border bg-white pr-3.5 pl-10 text-[14px] text-ink placeholder:text-muted/80 transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none ${
      error ? "border-brand-dark" : "border-line hover:border-ink/20"
    }`,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink">
        {label} <span aria-hidden="true" className="text-brand-dark">*</span>
        <span className="sr-only"> (required)</span>
      </label>
      <div className="relative">
        <Icon size={17} strokeWidth={1.8} aria-hidden="true" className={`pointer-events-none absolute left-3.5 text-muted ${multiline ? "top-3.5" : "top-1/2 -translate-y-1/2"}`} />
        {multiline ? (
          <textarea ref={inputRef} rows={5} {...shared} className={`${shared.className} min-h-[120px] resize-y py-3 leading-relaxed`} />
        ) : (
          <input ref={inputRef} type={type} {...shared} className={`${shared.className} h-11`} />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-[12px] font-medium text-brand-dark">
          <CircleAlert size={14} strokeWidth={2.2} aria-hidden="true" className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const refs = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const inFlight = useRef(false);
  const successRef = useRef<HTMLParagraphElement>(null);

  // Move focus to the confirmation so screen readers announce it.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const onChange = (name: FieldName, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    // After the first submit, errors update live as the visitor fixes them.
    if (attempted) setErrors(validate(next));
    if (status === "error") setStatus("idle");
  };
  const onBlur = (name: FieldName) => {
    if (attempted) setErrors(validate(values));
    else if (name === "email" && values.email.trim() && !EMAIL_RE.test(values.email.trim())) {
      setErrors((e) => ({ ...e, email: validate(values).email }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (inFlight.current) return; // no duplicate submissions

    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    const firstInvalid = ORDER.find((f) => found[f]);
    if (firstInvalid) {
      const count = Object.keys(found).length;
      setStatus("error");
      setFeedback(`Please fix ${count} ${count === 1 ? "field" : "fields"} highlighted below.`);
      refs.current[firstInvalid]?.focus();
      return;
    }

    // Bots fill the hidden field; humans never see it. Quietly drop the submission.
    if (honeypot) {
      setStatus("success");
      return;
    }

    if (!CONTACT_FORM.endpoint) {
      setStatus("error");
      setFeedback(CONTACT_FORM.notConfiguredMessage);
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setFeedback("Sending your message…");
    try {
      const response = await fetch(CONTACT_FORM.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus("success");
      setFeedback("");
      setValues(EMPTY);
      setAttempted(false);
    } catch {
      setStatus("error");
      setFeedback(CONTACT_FORM.errorMessage);
    } finally {
      inFlight.current = false;
    }
  };

  const fieldProps = (name: FieldName) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange,
    onBlur,
    inputRef: (el: HTMLInputElement | HTMLTextAreaElement | null) => {
      refs.current[name] = el;
    },
  });

  return (
    <section aria-labelledby="message-title" className="rounded-2xl border border-line bg-mist p-6 md:p-7">
      <h2 id="message-title" className="font-display text-[24px] leading-tight font-extrabold tracking-[-0.4px] text-ink md:text-[26px]">
        Send Us a <span className="text-brand">Message</span>
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">Fill out the form and we'll get back to you as soon as possible.</p>

      {status === "success" ? (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-line bg-white px-6 py-10 text-center">
          <CircleCheck size={40} strokeWidth={1.8} aria-hidden="true" className="text-brand" />
          <p ref={successRef} tabIndex={-1} className="mt-3 font-display text-[18px] font-bold text-ink focus:outline-none">
            {CONTACT_FORM.successTitle}
          </p>
          <p className="mt-1 max-w-sm text-[13px] text-muted">{CONTACT_FORM.successMessage}</p>
          <button type="button" onClick={() => setStatus("idle")} className={buttonClasses("outlineDark", "sm", "mt-5 bg-white")}>
            Send another message
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-describedby="form-note">
          <p id="form-note" className="text-[12px] text-muted sm:col-span-2">
            Fields marked <span aria-hidden="true" className="text-brand-dark">*</span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>
          <Field {...fieldProps("name")} label="Full Name" placeholder="Your Name" icon={UserRound} autoComplete="name" maxLength={100} />
          <Field {...fieldProps("email")} label="Email Address" placeholder="Your Email" icon={Mail} type="email" autoComplete="email" maxLength={254} />
          <Field {...fieldProps("subject")} label="Subject" placeholder="Subject" icon={MessageSquare} maxLength={150} className="sm:col-span-2" />
          <Field {...fieldProps("message")} label="Message" placeholder="Your Message" icon={MessageCircle} multiline maxLength={3000} className="sm:col-span-2" />

          {/* Spam trap: hidden from people and assistive tech. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Company
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>
          </div>

          <div aria-live="polite" className="sm:col-span-2">
            {status === "error" && feedback && (
              <p role="alert" className="flex items-start gap-2 rounded-lg border border-brand/25 bg-white px-3 py-2.5 text-[13px] text-brand-dark">
                <CircleAlert size={16} strokeWidth={2.2} aria-hidden="true" className="mt-px shrink-0" />
                {feedback}
              </p>
            )}
            {status === "submitting" && <p className="sr-only">{feedback}</p>}
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            aria-disabled={status === "submitting"}
            className={buttonClasses("primary", "md", "h-12 w-full disabled:cursor-wait disabled:opacity-80 sm:col-span-2")}
          >
            {status === "submitting" ? (
              <>
                <LoaderCircle size={18} strokeWidth={2.2} aria-hidden="true" className="motion-safe:animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send Message
                <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}
