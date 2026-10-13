import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, KeyRound, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { AuthField } from "../../components/auth/AuthField";
import { AuthLayout, authCard } from "../../components/auth/AuthLayout";
import { FormAlert } from "../../components/auth/FormAlert";
import { focusFirstError, readApiError } from "../../components/auth/formHelpers";
import { buttonClasses } from "../../components/ui/button";
import { authApi } from "../../lib/api";
import { collect, PASSWORD_MIN, rules, type FieldErrors } from "../../lib/authValidation";

const ORDER = ["email", "otp", "password", "password_confirmation"];

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [values, setValues] = useState({ email: params.get("email") ?? "", otp: "", password: "", password_confirmation: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  const set = (field: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: field === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value }));
  const refFor = (field: string) => (el: HTMLInputElement | null) => {
    refs.current[field] = el;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const found = collect({
      email: rules.email(values.email),
      otp: rules.otp(values.otp),
      password: rules.newPassword(values.password),
      password_confirmation: rules.confirmation(values.password_confirmation, values.password),
    });
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return focusFirstError(ORDER, found, refs.current);

    setSubmitting(true);
    try {
      await authApi.resetPassword({ ...values, email: values.email.trim(), otp: values.otp.trim() });
      navigate(`/login?email=${encodeURIComponent(values.email.trim())}`, {
        replace: true,
        state: { notice: "Your password has been reset. Please log in with your new password." },
      });
    } catch (error) {
      const { fieldErrors, formError } = readApiError(error, ORDER);
      setErrors(fieldErrors);
      setFormError(formError);
      setValues((v) => ({ ...v, password: "", password_confirmation: "" }));
      focusFirstError(ORDER, fieldErrors, refs.current);
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      titleId="reset-title"
      eyebrow="Reset your password"
      title={
        <>
          Choose a new <span className="text-brand">password</span>
        </>
      }
      description="Enter the 6-digit code we emailed you. Codes are valid for 15 minutes."
    >
      <form noValidate onSubmit={onSubmit} className={`${authCard} flex flex-col gap-4`} aria-busy={submitting}>
        <AuthField ref={refFor("email")} label="Email Address" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onValueChange={set("email")} error={errors.email} />
        <AuthField
          ref={refFor("otp")}
          label="6-digit Code"
          icon={KeyRound}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          maxLength={6}
          value={values.otp}
          onValueChange={set("otp")}
          error={errors.otp}
          className="[&_input]:tracking-[0.3em]"
        />
        <AuthField
          ref={refFor("password")}
          label="New Password"
          icon={LockKeyhole}
          type="password"
          autoComplete="new-password"
          placeholder="Create a new password"
          hint={`At least ${PASSWORD_MIN} characters.`}
          value={values.password}
          onValueChange={set("password")}
          error={errors.password}
        />
        <AuthField
          ref={refFor("password_confirmation")}
          label="Confirm New Password"
          icon={LockKeyhole}
          type="password"
          autoComplete="new-password"
          placeholder="Type it again"
          value={values.password_confirmation}
          onValueChange={set("password_confirmation")}
          error={errors.password_confirmation}
        />
        {formError && <FormAlert tone="error">{formError}</FormAlert>}
        <button type="submit" disabled={submitting} className={buttonClasses("primary", "md", "h-12 w-full disabled:cursor-wait disabled:opacity-80")}>
          {submitting ? (
            <>
              <LoaderCircle size={18} strokeWidth={2.2} aria-hidden="true" className="motion-safe:animate-spin" />
              Resetting…
            </>
          ) : (
            <>
              Reset Password
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="text-center text-[13px] text-muted">
          Didn't get a code?{" "}
          <Link to="/forgot-password" className="font-semibold text-brand-dark hover:underline">
            Send a new one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
