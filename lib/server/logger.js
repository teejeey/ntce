const PREFIX = "[NTCE:api]";

function shouldLogDetail() {
  return (
    process.env.NTCE_API_DEBUG === "1" ||
    process.env.NODE_ENV !== "production"
  );
}

function redactEmail(email) {
  const s = String(email || "").trim();
  if (!s || !shouldLogDetail()) return s ? "[redacted]" : "";
  const at = s.indexOf("@");
  if (at < 1) return "[invalid]";
  return `${s.slice(0, 2)}…@${s.slice(at + 1)}`;
}

/**
 * Debug-oriented logs (timings, outcomes). Avoids full PII in production unless NTCE_API_DEBUG=1.
 */
export function logGasRequest(operation, meta = {}) {
  if (!shouldLogDetail()) return;
  const safe = { ...meta };
  if (Object.prototype.hasOwnProperty.call(safe, "email")) {
    safe.email = redactEmail(safe.email);
  }
  console.info(PREFIX, "gas", operation, safe);
}

export function logGasResult(operation, startedAt, result, extra = {}) {
  const ok = result?.ok ?? result?.success;
  if (ok && process.env.NODE_ENV === "production" && process.env.NTCE_API_DEBUG !== "1") {
    return;
  }

  const ms = typeof startedAt === "number" ? Date.now() - startedAt : undefined;
  const line = {
    ok,
    ms,
    ...extra,
  };
  if (result?.error && typeof result.error === "string") {
    line.errorPreview = result.error.slice(0, 120);
  }
  const level = line.ok ? "info" : "warn";
  console[level](PREFIX, "gas", operation, line);
}

export function logValidationFailure(where, reason) {
  console.warn(PREFIX, "validation", where, reason);
}
