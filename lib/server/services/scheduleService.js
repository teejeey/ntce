import { gasFetchSchedule } from "../clients/gasClient";
import { createGasReadCache } from "./gasReadCacheCore";

const fetchScheduleCached = createGasReadCache(["gas", "schedule", "v1"], () =>
  gasFetchSchedule({})
);

export async function getSchedule(options = {}) {
  if (!fetchScheduleCached) {
    const result = await gasFetchSchedule(options);
    if (result.ok) {
      return { success: true, data: result.data, error: undefined };
    }
    return { success: false, data: null, error: result.error };
  }
  try {
    const result = await fetchScheduleCached();
    return { success: true, data: result.data, error: undefined };
  } catch {
    const result = await gasFetchSchedule(options);
    if (result.ok) {
      return { success: true, data: result.data, error: undefined };
    }
    return { success: false, data: null, error: result.error };
  }
}
