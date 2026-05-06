/**
 * CORS for route handlers. Same-origin fetches work without these headers; they help
 * cross-origin clients when `CORS_ALLOWED_ORIGINS` is set, or `*` when unset (no credentials).
 */
export function corsHeaders(request) {
  const origin = request.headers.get("origin");
  const allowed = String(process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const headers = new Headers();
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");

  if (allowed.length > 0 && origin && allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.append("Vary", "Origin");
  }

  return headers;
}
