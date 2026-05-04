/** Default ceilings for outbound Google Apps Script requests (milliseconds). */
export const GAS_TIMEOUT_MS = {
  schedule: 12_000,
  /** Cold/slow Apps Script runs often exceed 8s; align with schedule tolerance. */
  events: 12_000,
  speakers: 12_000,
  checkEmail: 12_000,
  postRegistration: 20_000,
};
