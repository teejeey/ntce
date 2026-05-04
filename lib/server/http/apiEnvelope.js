/**
 * Canonical JSON body shape for `/api/*` responses (success + error).
 */
export function apiSuccess(data) {
  return { success: true, data };
}

export function apiFailure(error, data = null) {
  return { success: false, data, error };
}
