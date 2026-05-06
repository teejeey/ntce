const buckets = new Map();

function nowMs() {
  return Date.now();
}

function pruneExpired(ts) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= ts) {
      buckets.delete(key);
    }
  }
}

export function getClientIp(request) {
  const forwarded = String(request.headers.get("x-forwarded-for") || "").trim();
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    String(request.headers.get("x-real-ip") || "").trim() ||
    String(request.headers.get("cf-connecting-ip") || "").trim() ||
    "unknown"
  );
}

export function enforceRateLimit(request, scope, options = {}) {
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 10;
  const windowMs = Number(options.windowMs) > 0 ? Number(options.windowMs) : 60_000;
  const ts = nowMs();
  const ip = getClientIp(request);
  const identifier =
    typeof options.identifier === "string" && options.identifier.trim()
      ? options.identifier.trim().toLowerCase()
      : ip;
  const key = `${scope}:${identifier}`;

  pruneExpired(ts);

  const current = buckets.get(key);
  if (!current || current.resetAt <= ts) {
    buckets.set(key, { count: 1, resetAt: ts + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  current.count += 1;
  if (current.count > limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - ts) / 1000)),
    };
  }

  return { allowed: true, retryAfterSec: 0 };
}
