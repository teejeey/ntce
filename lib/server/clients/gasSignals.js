/**
 * Combines a timeout with an optional caller AbortSignal (e.g. `request.signal`).
 *
 * Do not use `AbortSignal.any([AbortSignal.timeout(), request.signal])` here: on Node/undici
 * those signals can come from different implementations and `fetch` may throw
 * "Cannot read private member #signal from an object whose class did not declare it".
 * Instead we forward abort events into a single `AbortController` from this module.
 */
export function mergeTimeoutSignal(timeoutMs, userSignal) {
  const timeoutMsSafe = Number(timeoutMs) > 0 ? Number(timeoutMs) : 12_000;
  const timeoutSignal = AbortSignal.timeout(timeoutMsSafe);
  if (!userSignal) return timeoutSignal;

  const controller = new AbortController();
  const forward = () => {
    try {
      controller.abort();
    } catch {
      // ignore double-abort
    }
  };

  if (timeoutSignal.aborted || userSignal.aborted) {
    forward();
    return controller.signal;
  }

  try {
    timeoutSignal.addEventListener("abort", forward, { once: true });
    if (typeof userSignal.addEventListener === "function") {
      userSignal.addEventListener("abort", forward, { once: true });
    }
  } catch {
    return timeoutSignal;
  }

  return controller.signal;
}
