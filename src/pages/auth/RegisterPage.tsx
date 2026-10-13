import { useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { AuthField } from "../../components/auth/AuthField";
import { AuthLayout, authCard } from "../../components/auth/AuthLayout";
import { FormAlert } from "../../components/auth/FormAlert";
import { focusFirstError, readApiError } from "../../components/auth/formHelpers";
import { buttonClasses } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { collect, PASSWORD_MIN, PHONE_MAX, rules, type FieldErrors } from "../../lib/authValidation";

const ORDER = ["name", "email", "phone", "password", "password_confirmation"];

export function RegisterPage() {
  const { register } = useAuth();
  const [params] = useSearchParams();
  const next = params.get("next");

  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "", password_confirmation: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  const set = (field: keyof typeof values) => (value: string) => setValues((v) => ({ ...v, [field]: value }));
  const refFor = (field: string) => (el: HTMLInputElement | null) => {
    refs.current[field] = el;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const found = collect({
      name: rules.name(values.name),
      email: rules.email(values.email),
      phone: rules.phoneOptional(values.phone),
      password: rules.newPassword(values.password),
      password_confirmation: rules.confirmation(values.password_confirmation, values.password),
    });
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return focusFirstError(ORDER, found, refs.current);

    setSubmitting(true);
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      // GuestOnly redirects once the session exists.
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
      titleId="register-title"
      eyebrow="Join BurgerBite"
      title={
        <>
          Create your <span className="text-brand">account</span>
        </>
      }
      description="It only takes a minute."
    >
      <form noValidate onSubmit={onSubmit} className={`${authCard} flex flex-col gap-4`} aria-busy={submitting}>
        <AuthField ref={refFor("name")} label="Full Name" icon={UserRound} autoComplete="name" placeholder="Your name" value={values.name} onValueChange={set("name")} error={errors.name} />
        <AuthField ref={refFor("email")} label="Email Address" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onValueChange={set("email")} error={errors.email} />
        <AuthField
          ref={refFor("phone")}
          label="Phone"
          optional
          icon={Phone}
          type="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          maxLength={PHONE_MAX}
          hint={`Up to ${PHONE_MAX} characters.`}
          value={values.phone}
          onValueChange={set("phone")}
          error={errors.phone}
        />
        <AuthField
          ref={refFor("password")}
          label="Password"
          icon={LockKeyhole}
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          hint={`At least ${PASSWORD_MIN} characters.`}
          value={values.password}
          onValueChange={set("password")}
          error={errors.password}
        />
        <AuthField
          ref={refFor("password_confirmation")}
          label="Confirm Password"
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
              Creating account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="text-center text-[13px] text-muted">
          Already have an account?{" "}
          <Link to={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-semibold text-brand-dark hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
