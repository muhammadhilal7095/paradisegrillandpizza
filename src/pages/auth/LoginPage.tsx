import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { AuthField } from "../../components/auth/AuthField";
import { AuthLayout, authCard } from "../../components/auth/AuthLayout";
import { FormAlert } from "../../components/auth/FormAlert";
import { focusFirstError, readApiError } from "../../components/auth/formHelpers";
import { buttonClasses } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { collect, rules, type FieldErrors } from "../../lib/authValidation";

const ORDER = ["email", "password"];

export function LoginPage() {
  const { login, clearSignOutNotice } = useAuth();
  const location = useLocation();
  const [params] = useSearchParams();
  const notice = (location.state as { notice?: string } | null)?.notice;
  const next = params.get("next");

  // The notice now lives in this page's history state; don't repeat it on later redirects.
  useEffect(() => clearSignOutNotice(), [clearSignOutNotice]);

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const found = collect({ email: rules.email(email), password: rules.passwordRequired(password) });
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return focusFirstError(ORDER, found, refs.current);

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // GuestOnly redirects to `next` (or /account) as soon as the session exists.
    } catch (error) {
      const { fieldErrors, formError } = readApiError(error, ORDER);
      setErrors(fieldErrors);
      setFormError(formError);
      setPassword(""); // never keep a failed password around
      focusFirstError(ORDER, fieldErrors, refs.current);
      setSubmitting(false);
    }
  };

  const withNext = (path: string) => (next ? `${path}?next=${encodeURIComponent(next)}` : path);

  return (
    <AuthLayout
      titleId="login-title"
      eyebrow="Welcome back"
      title={
        <>
          Log in to <span className="text-brand">BurgerBite</span>
        </>
      }
      description="Access your account and profile."
    >
      <form noValidate onSubmit={onSubmit} className={`${authCard} flex flex-col gap-4`} aria-busy={submitting}>
        {notice && <FormAlert tone="info">{notice}</FormAlert>}
        <AuthField
          ref={(el) => {
            refs.current.email = el;
          }}
          label="Email Address"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onValueChange={setEmail}
          error={errors.email}
        />
        <AuthField
          ref={(el) => {
            refs.current.password = el;
          }}
          label="Password"
          icon={LockKeyhole}
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onValueChange={setPassword}
          error={errors.password}
        />
        <div className="-mt-1 text-right">
          <Link to="/forgot-password" className="text-[13px] font-semibold text-brand-dark hover:underline">
            Forgot password?
          </Link>
        </div>
        {formError && <FormAlert tone="error">{formError}</FormAlert>}
        <button type="submit" disabled={submitting} className={buttonClasses("primary", "md", "h-12 w-full disabled:cursor-wait disabled:opacity-80")}>
          {submitting ? (
            <>
              <LoaderCircle size={18} strokeWidth={2.2} aria-hidden="true" className="motion-safe:animate-spin" />
              Logging in…
            </>
          ) : (
            <>
              Log In
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="text-center text-[13px] text-muted">
          New to BurgerBite?{" "}
          <Link to={withNext("/register")} className="font-semibold text-brand-dark hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
