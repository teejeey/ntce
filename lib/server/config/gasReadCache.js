/**
 * Server-side cache for read-only GAS proxies (events / schedule / speakers).
 * Default is disabled for near-instant sheet updates. Set `GAS_READ_CACHE_SECONDS` to enable.
 */
function clampInt(n, min, max, fallback) {
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export function gasReadServerRevalidateSeconds() {
  if (process.env.GAS_READ_CACHE_SECONDS === "0") return 0;
  const raw = process.env.GAS_READ_CACHE_SECONDS;
  if (raw === undefined || raw === "") return 0;
  const n = Number.parseInt(String(raw), 10);
  return clampInt(n, 0, 600, 0);
}

/** `Cache-Control` max-age for successful GET /api/{events,schedule,speakers} (browser). */
export function gasReadBrowserMaxAgeSeconds() {
  if (process.env.GAS_READ_BROWSER_MAX_AGE_SECONDS === "0") return 0;
  const raw = process.env.GAS_READ_BROWSER_MAX_AGE_SECONDS;
  if (raw === undefined || raw === "") return 0;
  const n = Number.parseInt(String(raw), 10);
  return clampInt(n, 0, 120, 0);
}

export function gasReadSuccessCacheHeaders() {
  const maxAge = gasReadBrowserMaxAgeSeconds();
  if (maxAge <= 0) {
    return {
      "Cache-Control": "no-store, max-age=0",
    };
  }
  const swr = Math.min(300, maxAge * 4);
  return {
    "Cache-Control": `private, max-age=${maxAge}, stale-while-revalidate=${swr}`,
  };
}
