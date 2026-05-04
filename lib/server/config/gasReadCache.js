/**
 * Server-side cache for read-only GAS proxies (events / schedule / speakers).
 * Set `GAS_READ_CACHE_SECONDS=0` to disable (every request hits Apps Script).
 */
function clampInt(n, min, max, fallback) {
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export function gasReadServerRevalidateSeconds() {
  if (process.env.GAS_READ_CACHE_SECONDS === "0") return 0;
  const raw = process.env.GAS_READ_CACHE_SECONDS;
  if (raw === undefined || raw === "") return 45;
  const n = Number.parseInt(String(raw), 10);
  return clampInt(n, 0, 600, 45);
}

/** `Cache-Control` max-age for successful GET /api/{events,schedule,speakers} (browser). */
export function gasReadBrowserMaxAgeSeconds() {
  if (process.env.GAS_READ_BROWSER_MAX_AGE_SECONDS === "0") return 0;
  const raw = process.env.GAS_READ_BROWSER_MAX_AGE_SECONDS;
  if (raw === undefined || raw === "") return 30;
  const n = Number.parseInt(String(raw), 10);
  return clampInt(n, 0, 120, 30);
}

export function gasReadSuccessCacheHeaders() {
  const maxAge = gasReadBrowserMaxAgeSeconds();
  if (maxAge <= 0) return {};
  const swr = Math.min(300, maxAge * 4);
  return {
    "Cache-Control": `private, max-age=${maxAge}, stale-while-revalidate=${swr}`,
  };
}
