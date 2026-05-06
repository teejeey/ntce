/** HTTP status for upstream Google Apps Script / config failures from service `error` strings. */
export function gasErrorHttpStatus(error) {
  if (!error) return 500;
  const s = String(error).toLowerCase();
  if (s.includes("not configured")) return 503;
  return 502;
}

/** Same as gas plus 400 when the error indicates a missing email query param. */
export function checkEmailQueryErrorStatus(error) {
  if (!error) return 500;
  const s = String(error).toLowerCase();
  if (s.includes("not configured")) return 503;
  if (s.includes("query parameter is required")) return 400;
  return 502;
}

/**
 * Public-safe upstream error message for client responses.
 */
export function sanitizeUpstreamError(error, fallback = "Service is temporarily unavailable.") {
  const s = String(error || "").toLowerCase();
  if (s.includes("not configured")) return "Service is temporarily unavailable.";
  if (s.includes("timed out") || s.includes("timeout") || s.includes("aborted")) {
    return "Service is temporarily unavailable.";
  }
  if (s.includes("failed to fetch") || s.includes("responded with")) {
    return "Service is temporarily unavailable.";
  }
  return fallback;
}
