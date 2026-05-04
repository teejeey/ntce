/**
 * Combines a timeout with an optional caller AbortSignal (client disconnect).
 */
export function mergeTimeoutSignal(timeoutMs, userSignal) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  if (!userSignal) return timeoutSignal;
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([timeoutSignal, userSignal]);
  }
  return timeoutSignal;
}
