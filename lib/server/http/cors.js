/**
 * CORS for route handlers. Same-origin fetches work without these headers; they help
 * cross-origin clients when `CORS_ALLOWED_ORIGINS` is set, or `*` when unset (no credentials).
 */
export function corsHeaders(request) {
  const origin = request.headers.get("origin");
  const normalizeOrigin = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\/+$/, "");
  const normalizedOrigin = normalizeOrigin(origin);
  const allowed = String(process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => normalizeOrigin(s))
    .filter(Boolean);

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

  if (allowed.length > 0 && origin && allowed.includes(normalizedOrigin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.append("Vary", "Origin");
  }

  return headers;
}
