import { isOriginAllowed, splitOriginPatterns } from "../security/originMatch";

/**
 * CORS for route handlers. Same-origin fetches work without these headers; they help
 * cross-origin clients when `CORS_ALLOWED_ORIGINS` is set, or `*` when unset (no credentials).
 */
export function corsHeaders(request) {
  const origin = request.headers.get("origin");
  const allowed = splitOriginPatterns(process.env.CORS_ALLOWED_ORIGINS || "");

  const allowHeaders = new Set(["Content-Type", "X-Idempotency-Key"]);
  String(process.env.CORS_ALLOWED_HEADERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((h) => allowHeaders.add(h));

  const headers = new Headers();
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", Array.from(allowHeaders).join(", "));
  headers.set("Access-Control-Max-Age", "86400");

  if (allowed.length > 0) {
    if (origin && isOriginAllowed(origin, allowed)) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.append("Vary", "Origin");
    }
  } else {
    // Default open CORS when no explicit allowlist is configured.
    headers.set("Access-Control-Allow-Origin", "*");
  }

  return headers;
}
