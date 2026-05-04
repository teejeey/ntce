import { unstable_cache } from "next/cache";
import { gasReadServerRevalidateSeconds } from "../config/gasReadCache";

const REV = gasReadServerRevalidateSeconds();

/**
 * Wraps a GAS fetch so identical reads share one Apps Script round-trip for `revalidate` seconds.
 * Failures are not cached (callback throws).
 */
export function createGasReadCache(cacheKey, fetcher) {
  if (REV <= 0) return null;
  return unstable_cache(
    async () => {
      const result = await fetcher();
      if (!result.ok) {
        throw new Error(String(result.error || "gas"));
      }
      return result;
    },
    cacheKey,
    { revalidate: REV }
  );
}
