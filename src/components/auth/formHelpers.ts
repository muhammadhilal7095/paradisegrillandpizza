import { ApiError } from "../../lib/api";
import type { FieldErrors } from "../../lib/authValidation";

export const DISABLED_ACCOUNT_MESSAGE = "Your account has been disabled. Please contact our support team for help.";

/**
 * Turns a failed request into { fieldErrors, formError } for a form.
 * 422 → messages under the matching fields (unknown fields fall back to the form message).
 * 403 → account disabled. Anything else → a friendly sentence.
 */
export function readApiError(error: unknown, knownFields: string[]): { fieldErrors: FieldErrors; formError: string } {
  if (!(error instanceof ApiError)) {
    return { fieldErrors: {}, formError: "Something went wrong. Please try again." };
  }
  if (error.kind === "forbidden") return { fieldErrors: {}, formError: DISABLED_ACCOUNT_MESSAGE };
  if (error.kind === "validation") {
    const fieldErrors: FieldErrors = {};
    const leftovers: string[] = [];
    for (const [field, message] of Object.entries(error.fieldErrors)) {
      if (knownFields.includes(field)) fieldErrors[field] = message;
      else leftovers.push(message);
    }
    const formError = leftovers.length ? leftovers.join(" ") : Object.keys(fieldErrors).length ? "" : error.message;
    return { fieldErrors, formError };
  }
  return { fieldErrors: {}, formError: error.message };
}

/** Focus the first field (in order) that has an error. */
export function focusFirstError(order: string[], errors: FieldErrors, refs: Record<string, HTMLInputElement | null>) {
  const first = order.find((f) => errors[f]);
  if (first) refs[first]?.focus();
}
