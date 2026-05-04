import { gasFetchSpeakers } from "../clients/gasClient";
import { createGasReadCache } from "./gasReadCacheCore";

const fetchSpeakersCached = createGasReadCache(["gas", "speakers", "v1"], () =>
  gasFetchSpeakers({})
);

export async function getSpeakers(options = {}) {
  if (!fetchSpeakersCached) {
    const result = await gasFetchSpeakers(options);
    if (result.ok) {
      return { success: true, data: result.data, error: undefined };
    }
    return { success: false, data: null, error: result.error };
  }
  try {
    const result = await fetchSpeakersCached();
    return { success: true, data: result.data, error: undefined };
  } catch {
    const result = await gasFetchSpeakers(options);
    if (result.ok) {
      return { success: true, data: result.data, error: undefined };
    }
    return { success: false, data: null, error: result.error };
  }
}
