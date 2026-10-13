/** Client-side checks that mirror the auth API's rules, so most mistakes are caught before a request. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PASSWORD_MIN = 6;
export const PHONE_MAX = 20;

export type FieldErrors = Record<string, string>;

export const rules = {
  name: (v: string) => (v.trim() ? "" : "Please enter your full name."),
  email: (v: string) => (!v.trim() ? "Please enter your email address." : EMAIL_RE.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com."),
  phoneOptional: (v: string) => (v.trim().length > PHONE_MAX ? `Phone number must be ${PHONE_MAX} characters or fewer.` : ""),
  passwordRequired: (v: string) => (v ? "" : "Please enter your password."),
  newPassword: (v: string) => (!v ? "Please choose a password." : v.length < PASSWORD_MIN ? `Password must be at least ${PASSWORD_MIN} characters.` : ""),
  confirmation: (v: string, password: string) => (!v ? "Please confirm your password." : v !== password ? "Passwords don't match." : ""),
  otp: (v: string) => (/^\d{6}$/.test(v.trim()) ? "" : "Enter the 6-digit code from your email."),
};

/** Drops empty messages so `Object.keys(errors).length` means "has errors". */
export function collect(errors: FieldErrors): FieldErrors {
  return Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg));
}
