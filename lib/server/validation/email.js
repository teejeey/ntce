import { COMPLETE_EMAIL_PATTERN } from "../../emailPatterns";

const EMAIL_RE = COMPLETE_EMAIL_PATTERN;
const MAX_EMAIL_LEN = 254;

export function validateEmailQuery(raw) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) {
    return { ok: false, error: "email query parameter is required." };
  }
  if (trimmed.length > MAX_EMAIL_LEN) {
    return { ok: false, error: "email is too long." };
  }
  if (!EMAIL_RE.test(trimmed)) {
    return { ok: false, error: "email format is invalid." };
  }
  return { ok: true, email: trimmed };
}
