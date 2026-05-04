/**
 * Read a query param from the request URL (canonical) with nextUrl fallback.
 * Avoids edge cases where `nextUrl.searchParams` is empty in dev / first compile.
 */
export function getRequestSearchParam(request, name) {
  try {
    const u = new URL(request.url);
    const v = u.searchParams.get(name);
    if (v != null && v !== "") return v;
  } catch {
    // fall through
  }
  return request.nextUrl.searchParams.get(name);
}
