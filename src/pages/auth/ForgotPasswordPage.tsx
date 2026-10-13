import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { AuthField } from "../../components/auth/AuthField";
import { AuthLayout, authCard } from "../../components/auth/AuthLayout";
import { FormAlert } from "../../components/auth/FormAlert";
import { readApiError } from "../../components/auth/formHelpers";
import { buttonClasses } from "../../components/ui/button";
import { authApi } from "../../lib/api";
import { rules } from "../../lib/authValidation";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | undefined>();
  const emailRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const problem = rules.email(email);
    setError(problem);
    setFormError("");
    if (problem) return emailRef.current?.focus();

    setSubmitting(true);
    try {
      const result = await authApi.forgotPassword(email.trim());
      setSentTo(email.trim());
      // Only shown on a local dev build, and only if the API is running with APP_DEBUG=true.
      setDebugOtp(import.meta.env.DEV ? result.debugOtp : undefined);
    } catch (err) {
      const { fieldErrors, formError } = readApiError(err, ["email"]);
      setError(fieldErrors.email ?? "");
      setFormError(formError);
      if (fieldErrors.email) emailRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      titleId="forgot-title"
      eyebrow="Reset your password"
      title={
        <>
          Forgot your <span className="text-brand">password?</span>
        </>
      }
      description="Enter your email and we'll send you a 6-digit code to reset it."
    >
      {sentTo ? (
        <div className={`${authCard} flex flex-col gap-4`}>
          <FormAlert tone="success">
            If an account exists for <strong className="font-semibold">{sentTo}</strong>, we've sent a 6-digit code to it. The code is valid
            for 15 minutes.
          </FormAlert>
          {debugOtp && <FormAlert tone="info">Development only — test code from the API: {debugOtp}</FormAlert>}
          <Link to={`/reset-password?email=${encodeURIComponent(sentTo)}`} className={buttonClasses("primary", "md", "h-12 w-full")}>
            Enter Code
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
          <button type="button" onClick={() => setSentTo(null)} className="text-[13px] font-semibold text-brand-dark hover:underline">
            Use a different email
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className={`${authCard} flex flex-col gap-4`} aria-busy={submitting}>
          <AuthField ref={emailRef} label="Email Address" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={email} onValueChange={setEmail} error={error} />
          {formError && <FormAlert tone="error">{formError}</FormAlert>}
          <button type="submit" disabled={submitting} className={buttonClasses("primary", "md", "h-12 w-full disabled:cursor-wait disabled:opacity-80")}>
            {submitting ? (
              <>
                <LoaderCircle size={18} strokeWidth={2.2} aria-hidden="true" className="motion-safe:animate-spin" />
                Sending code…
              </>
            ) : (
              <>
                Send Code
                <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </>
            )}
          </button>
          <p className="text-center text-[13px] text-muted">
            Already have a code?{" "}
            <Link to="/reset-password" className="font-semibold text-brand-dark hover:underline">
              Reset your password
            </Link>
            {" · "}
            <Link to="/login" className="font-semibold text-brand-dark hover:underline">
              Back to log in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
