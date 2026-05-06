const seenKeys = new Map();
const IDEMPOTENCY_WINDOW_MS = 2 * 60_000;

function nowMs() {
  return Date.now();
}

function prune(ts) {
  for (const [key, expiresAt] of seenKeys.entries()) {
    if (expiresAt <= ts) {
      seenKeys.delete(key);
    }
  }
}

export function consumeIdempotencyKey(rawKey) {
  const key = String(rawKey || "").trim();
  if (!key) {
    return { ok: true, key: "" };
  }

  const ts = nowMs();
  prune(ts);

  if (seenKeys.has(key)) {
    const retryAfterMs = Math.max(1000, seenKeys.get(key) - ts);
    return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  seenKeys.set(key, ts + IDEMPOTENCY_WINDOW_MS);
  return { ok: true, key };
}
