/**
 * Browser `fetch` timeout for same-origin `/api/*` (AbortSignal).
 * Keep this above server `GAS_TIMEOUT_MS` + network/Node overhead so the client
 * does not abort while the route handler is still waiting on Apps Script.
 */
export const API_ROUTE_CLIENT_TIMEOUT_MS = 18_000;
