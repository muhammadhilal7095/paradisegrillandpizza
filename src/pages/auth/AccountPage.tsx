import { useEffect, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, LockKeyhole, LogOut, Mail, Phone, RefreshCw, Save, UserRound } from "lucide-react";
import { AuthField } from "../../components/auth/AuthField";
import { AuthLayout, authCard } from "../../components/auth/AuthLayout";
import { FormAlert } from "../../components/auth/FormAlert";
import { focusFirstError, readApiError } from "../../components/auth/formHelpers";
import { buttonClasses } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { authApi, type User } from "../../lib/api";
import { collect, PASSWORD_MIN, PHONE_MAX, rules, type FieldErrors } from "../../lib/authValidation";

function Spinner() {
  return <LoaderCircle size={18} strokeWidth={2.2} aria-hidden="true" className="motion-safe:animate-spin" />;
}

/** Name + phone, loaded fresh from GET /me; saves only changed fields with PUT /profile. */
function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [values, setValues] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [original, setOriginal] = useState<User | null>(user);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = () => {
    setLoading(true);
    setLoadError("");
    authApi
      .me()
      .then((me) => {
        setOriginal(me);
        setValues({ name: me.name ?? "", phone: me.phone ?? "" });
      })
      .catch((error) => setLoadError(readApiError(error, []).formError)) // 401 redirects globally
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    const found = collect({ name: rules.name(values.name), phone: rules.phoneOptional(values.phone) });
    setErrors(found);
    setFormError("");
    setSuccess("");
    if (Object.keys(found).length) return focusFirstError(["name", "phone"], found, refs.current);

    const changes: { name?: string; phone?: string } = {};
    if (values.name.trim() !== (original?.name ?? "")) changes.name = values.name.trim();
    if (values.phone.trim() !== (original?.phone ?? "")) changes.phone = values.phone.trim();
    if (!Object.keys(changes).length) return setSuccess("Nothing to update — your profile is already up to date.");

    setSaving(true);
    try {
      const updated = await updateProfile(changes);
      setOriginal(updated);
      setValues({ name: updated.name ?? "", phone: updated.phone ?? "" });
      setSuccess("Your profile has been updated.");
    } catch (error) {
      const { fieldErrors, formError } = readApiError(error, ["name", "phone"]);
      setErrors(fieldErrors);
      setFormError(formError);
      focusFirstError(["name", "phone"], fieldErrors, refs.current);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="profile-title" className={authCard}>
      <h2 id="profile-title" className="font-display text-[20px] font-extrabold tracking-[-0.3px] text-ink">
        Your <span className="text-brand">Profile</span>
      </h2>
      {loading ? (
        <p role="status" className="mt-6 flex items-center gap-2 text-[14px] text-muted">
          <Spinner /> Loading your profile…
        </p>
      ) : loadError ? (
        <div className="mt-5 flex flex-col items-start gap-3">
          <FormAlert tone="error">{loadError}</FormAlert>
          <button type="button" onClick={load} className={buttonClasses("outlineDark", "sm")}>
            <RefreshCw size={15} strokeWidth={2} aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="mt-5 flex flex-col gap-4" aria-busy={saving}>
          <div>
            <p className="mb-1.5 text-[13px] font-medium text-ink">Email Address</p>
            <p className="flex h-11 items-center gap-2.5 rounded-xl border border-line bg-mist px-3.5 text-[14px] break-all text-soft">
              <Mail size={17} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-muted" />
              {original?.email}
            </p>
            <p className="mt-1.5 text-[12px] text-muted">Your email can't be changed here.</p>
          </div>
          <AuthField
            ref={(el) => {
              refs.current.name = el;
            }}
            label="Full Name"
            icon={UserRound}
            autoComplete="name"
            value={values.name}
            onValueChange={(name) => setValues((v) => ({ ...v, name }))}
            error={errors.name}
          />
          <AuthField
            ref={(el) => {
              refs.current.phone = el;
            }}
            label="Phone"
            optional
            icon={Phone}
            type="tel"
            autoComplete="tel"
            maxLength={PHONE_MAX}
            value={values.phone}
            onValueChange={(phone) => setValues((v) => ({ ...v, phone }))}
            error={errors.phone}
          />
          {formError && <FormAlert tone="error">{formError}</FormAlert>}
          {success && <FormAlert tone="success">{success}</FormAlert>}
          <button type="submit" disabled={saving} className={buttonClasses("primary", "md", "self-start disabled:cursor-wait disabled:opacity-80")}>
            {saving ? (
              <>
                <Spinner /> Saving…
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2} aria-hidden="true" /> Save Changes
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}

const PW_ORDER = ["current_password", "password", "password_confirmation"];

function ChangePasswordForm() {
  const empty = { current_password: "", password: "", password_confirmation: "" };
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const set = (field: keyof typeof empty) => (value: string) => setValues((v) => ({ ...v, [field]: value }));
  const refFor = (field: string) => (el: HTMLInputElement | null) => {
    refs.current[field] = el;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    const found = collect({
      current_password: rules.passwordRequired(values.current_password),
      password: rules.newPassword(values.password),
      password_confirmation: rules.confirmation(values.password_confirmation, values.password),
    });
    setErrors(found);
    setFormError("");
    setSuccess("");
    if (Object.keys(found).length) return focusFirstError(PW_ORDER, found, refs.current);

    setSaving(true);
    try {
      await authApi.changePassword(values);
      setSuccess("Your password has been changed.");
    } catch (error) {
      const { fieldErrors, formError } = readApiError(error, PW_ORDER);
      setErrors(fieldErrors);
      setFormError(formError);
      focusFirstError(PW_ORDER, fieldErrors, refs.current);
    } finally {
      setValues(empty); // passwords never linger in state after a submit
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="password-title" className={authCard}>
      <h2 id="password-title" className="font-display text-[20px] font-extrabold tracking-[-0.3px] text-ink">
        Change <span className="text-brand">Password</span>
      </h2>
      <form noValidate onSubmit={onSubmit} className="mt-5 flex flex-col gap-4" aria-busy={saving}>
        <AuthField ref={refFor("current_password")} label="Current Password" icon={LockKeyhole} type="password" autoComplete="current-password" value={values.current_password} onValueChange={set("current_password")} error={errors.current_password} />
        <AuthField ref={refFor("password")} label="New Password" icon={LockKeyhole} type="password" autoComplete="new-password" hint={`At least ${PASSWORD_MIN} characters.`} value={values.password} onValueChange={set("password")} error={errors.password} />
        <AuthField ref={refFor("password_confirmation")} label="Confirm New Password" icon={LockKeyhole} type="password" autoComplete="new-password" value={values.password_confirmation} onValueChange={set("password_confirmation")} error={errors.password_confirmation} />
        {formError && <FormAlert tone="error">{formError}</FormAlert>}
        {success && <FormAlert tone="success">{success}</FormAlert>}
        <button type="submit" disabled={saving} className={buttonClasses("primary", "md", "self-start disabled:cursor-wait disabled:opacity-80")}>
          {saving ? (
            <>
              <Spinner /> Updating…
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </section>
  );
}

export function AccountPage() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // After logout, RequireAuth sends the visitor to /login with a "logged out" notice.
  const onLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <AuthLayout
      wide
      titleId="account-title"
      eyebrow="My account"
      title={
        <>
          Hello, <span className="text-brand">{user?.name?.split(" ")[0] || "there"}</span>
        </>
      }
      description="Manage your details and password."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <ProfileForm />
        <ChangePasswordForm />
      </div>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={onLogout} disabled={loggingOut} className={buttonClasses("outlineDark", "md", "bg-white disabled:opacity-70")}>
          {loggingOut ? <Spinner /> : <LogOut size={16} strokeWidth={2} aria-hidden="true" />}
          {loggingOut ? "Logging out…" : "Log Out"}
        </button>
      </div>
    </AuthLayout>
  );
}
