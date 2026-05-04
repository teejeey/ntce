import { gasFetchEvents } from "../clients/gasClient";
import { createGasReadCache } from "./gasReadCacheCore";

const fetchEventsCached = createGasReadCache(["gas", "events", "v1"], () =>
  gasFetchEvents({})
);

export async function getEvents(options = {}) {
  if (!fetchEventsCached) {
    const result = await gasFetchEvents(options);
    if (result.ok) {
      return { success: true, data: result.data, error: undefined };
    }
    return { success: false, data: null, error: result.error };
  }
  try {
    const result = await fetchEventsCached();
    return { success: true, data: result.data, error: undefined };
  } catch {
    const result = await gasFetchEvents(options);
    if (result.ok) {
      return { success: true, data: result.data, error: undefined };
    }
    return { success: false, data: null, error: result.error };
  }
}
