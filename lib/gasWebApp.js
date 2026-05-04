import { API_ROUTE_CLIENT_TIMEOUT_MS } from "./apiRouteFetchDefaults";
import { COMPLETE_EMAIL_PATTERN } from "./emailPatterns";
import { parseJsonResponse } from "./parseJsonResponse";

export { getGasWebAppUrl } from "./gasEnv";

function trimTrailingSlash(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

/**
 * Resolves `/api/...` for fetches.
 * - Browser: if `NEXT_PUBLIC_API_BASE_URL` is set (e.g. `https://ntce.onrender.com`), uses that
 *   absolute base so a static site on cPanel can call your Render-hosted Next API.
 * - Otherwise the browser uses same-origin relative paths (`/api/...`) for local `next dev`.
 * - Server: prefers the same public API base, then `NEXT_PUBLIC_SITE_URL` / `INTERNAL_APP_URL`,
 *   then Vercel / localhost.
 */
export function getInternalApiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const publicApiBase =
    typeof process !== "undefined"
      ? trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL)
      : "";

  if (typeof window !== "undefined") {
    if (publicApiBase) return `${publicApiBase}${p}`;
    return p;
  }

  if (publicApiBase) return `${publicApiBase}${p}`;

  const explicit = trimTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.INTERNAL_APP_URL || ""
  );
  if (explicit) return `${explicit}${p}`;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^\/+/, "")}${p}`;
  }
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}${p}`;
}

/**
 * Loads schedule payload (day1/day2/day3) via the Next.js API route (wraps Apps Script).
 */
export async function fetchScheduleFromGas(options = {}) {
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : API_ROUTE_CLIENT_TIMEOUT_MS;
  const signal = options?.signal ?? AbortSignal.timeout(timeoutMs);

  try {
    const response = await fetch(getInternalApiUrl("/api/schedule"), {
      method: "GET",
      cache: "default",
      signal,
    });
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      const errorMessage =
        payload?.error ||
        payload?.raw ||
        `Server responded with ${response.status} ${response.statusText}`;
      return { ok: false, error: errorMessage };
    }

    const data = payload?.data;
    if (!data || typeof data !== "object") {
      return { ok: false, error: "Invalid schedule response from server." };
    }

    const day1 = Array.isArray(data.day1) ? data.day1 : [];
    const day2 = Array.isArray(data.day2) ? data.day2 : [];
    const day3 = Array.isArray(data.day3) ? data.day3 : [];

    return { ok: true, data: { day1, day2, day3 } };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "Could not load schedule.",
    };
  }
}

export async function fetchEventsFromGas(options = {}) {
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : API_ROUTE_CLIENT_TIMEOUT_MS;
  const signal =
    options?.signal ??
    (typeof AbortSignal !== "undefined" && AbortSignal.timeout
      ? AbortSignal.timeout(timeoutMs)
      : undefined);

  try {
    const response = await fetch(getInternalApiUrl("/api/events"), {
      method: "GET",
      cache: "default",
      ...(signal ? { signal } : {}),
    });
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      return {
        ok: false,
        error:
          payload?.error ||
          payload?.raw ||
          `Server responded with ${response.status} ${response.statusText}`,
      };
    }

    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return { ok: true, data: rows };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "Could not load events.",
    };
  }
}

export async function fetchSpeakersFromGas(options = {}) {
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : API_ROUTE_CLIENT_TIMEOUT_MS;
  const signal =
    options?.signal ??
    (typeof AbortSignal !== "undefined" && AbortSignal.timeout
      ? AbortSignal.timeout(timeoutMs)
      : undefined);

  try {
    const response = await fetch(getInternalApiUrl("/api/speakers"), {
      method: "GET",
      cache: "default",
      ...(signal ? { signal } : {}),
    });
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      return {
        ok: false,
        error:
          payload?.error ||
          payload?.raw ||
          `Server responded with ${response.status} ${response.statusText}`,
      };
    }

    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return { ok: true, data: rows };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "Could not load speakers.",
    };
  }
}

export async function checkEmailExistsViaGas(email, options = {}) {
  const trimmed = String(email || "").trim();
  // Avoid calling the API with a missing or partial email (prevents 400 "email query parameter is required.").
  if (!trimmed || !COMPLETE_EMAIL_PATTERN.test(trimmed)) {
    return { ok: true, exists: false };
  }

  const qs = new URLSearchParams({ email: trimmed });
  const url = `${getInternalApiUrl("/api/registration/check-email")}?${qs.toString()}`;

  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : API_ROUTE_CLIENT_TIMEOUT_MS;
  const signal =
    options?.signal ??
    (typeof AbortSignal !== "undefined" && AbortSignal.timeout
      ? AbortSignal.timeout(timeoutMs)
      : undefined);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      ...(signal ? { signal } : {}),
    });
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      const checkError =
        payload?.error ||
        payload?.raw ||
        `Server responded with ${response.status} ${response.statusText}`;
      return { ok: false, error: checkError };
    }

    return { ok: true, exists: payload?.data?.exists === true };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "Could not check email.",
    };
  }
}

export async function submitRegistrationViaGas(body, options = {}) {
  const {
    fullName,
    email,
    mobileNumber,
    organization,
    designation,
    attendance,
    topicInterest,
    message,
  } = body || {};

  if (
    !fullName ||
    !email ||
    !mobileNumber ||
    !organization ||
    !designation ||
    !attendance
  ) {
    return {
      ok: false,
      error:
        "Full name, email, mobile number, organization, designation, and attendance are required.",
    };
  }

  try {
    const response = await fetch(getInternalApiUrl("/api/registration"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        mobileNumber,
        organization,
        designation,
        attendance,
        topicInterest,
        message: message || "",
      }),
      cache: "no-store",
      ...(options.signal ? { signal: options.signal } : {}),
    });

    const payload = await parseJsonResponse(response);

    if (response.status === 409) {
      return {
        ok: false,
        error: payload?.error || "This email is already registered.",
        status: 409,
      };
    }

    if (!response.ok || payload?.success === false) {
      const errorMessage =
        payload?.error ||
        payload?.raw ||
        `Server responded with ${response.status} ${response.statusText}`;
      return { ok: false, error: errorMessage };
    }

    return { ok: true, data: payload?.data ?? payload };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "Could not process registration submission.",
    };
  }
}
