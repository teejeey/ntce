import { API_ROUTE_CLIENT_TIMEOUT_MS } from "./apiRouteFetchDefaults";
import { COMPLETE_EMAIL_PATTERN } from "./emailPatterns";
import { parseJsonResponse } from "./parseJsonResponse";

export { getGasWebAppUrl } from "./gasEnv";

function trimTrailingSlash(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function envFlagEnabled(value) {
  const v = String(value || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function toFriendlyUpstreamError(rawError, fallback) {
  const message = String(rawError || "").trim();
  if (!message) return fallback;
  const lower = message.toLowerCase();

  if (lower.includes("aborted") || lower.includes("timed out") || lower.includes("timeout")) {
    return "The service is taking too long to respond. Please try again.";
  }
  if (lower.includes("failed to fetch")) {
    return "Network error while contacting the service. Please check your connection and try again.";
  }
  if (lower.includes("google apps script")) {
    return "The backend service is temporarily unavailable. Please try again shortly.";
  }
  return fallback;
}

/**
 * Resolves `/api/...` for fetches.
 * - Browser:
 *   - If `NEXT_PUBLIC_API_BASE_URL` is set, uses it (Render/cross-origin mode)
 *   - But when running on localhost, prefers same-origin `/api/...` unless
 *     `NEXT_PUBLIC_FORCE_REMOTE_API=1` is set.
 * - Server:
 *   - In local dev, prefers same-origin localhost unless `NEXT_PUBLIC_FORCE_REMOTE_API=1`
 *   - Otherwise prefers `NEXT_PUBLIC_API_BASE_URL`, then `NEXT_PUBLIC_SITE_URL` / `INTERNAL_APP_URL`,
 *     then Vercel / localhost.
 */
export function getInternalApiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const publicApiBase =
    typeof process !== "undefined"
      ? trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL)
      : "";
  const forceRemoteApi =
    typeof process !== "undefined"
      ? envFlagEnabled(process.env.NEXT_PUBLIC_FORCE_REMOTE_API)
      : false;

  if (typeof window !== "undefined") {
    const host = String(window.location?.hostname || "").toLowerCase();
    const isLocalHost = host === "localhost" || host === "127.0.0.1";
    if (publicApiBase && (!isLocalHost || forceRemoteApi)) return `${publicApiBase}${p}`;
    return p;
  }

  const isLocalDev =
    String(process.env.NODE_ENV || "").toLowerCase() !== "production" &&
    !forceRemoteApi;
  if (!isLocalDev && publicApiBase) return `${publicApiBase}${p}`;

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
 * Loads schedule payload (day1–day4) via the Next.js API route (wraps Apps Script).
 */
export async function fetchScheduleFromGas(options = {}) {
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : API_ROUTE_CLIENT_TIMEOUT_MS;
  const signal = options?.signal ?? AbortSignal.timeout(timeoutMs);

  try {
    const response = await fetch(getInternalApiUrl("/api/schedule"), {
      method: "GET",
      cache: "no-store",
      signal,
    });
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      const errorMessage =
        payload?.error ||
        payload?.raw ||
        `Server responded with ${response.status} ${response.statusText}`;
      return {
        ok: false,
        error: toFriendlyUpstreamError(errorMessage, "Could not load schedule right now."),
      };
    }

    const data = payload?.data;
    if (!data || typeof data !== "object") {
      return { ok: false, error: "Invalid schedule response from server." };
    }

    const day1 = Array.isArray(data.day1) ? data.day1 : [];
    const day2 = Array.isArray(data.day2) ? data.day2 : [];
    const day3 = Array.isArray(data.day3) ? data.day3 : [];
    const day4 = Array.isArray(data.day4) ? data.day4 : [];

    return { ok: true, data: { day1, day2, day3, day4 } };
  } catch (error) {
    return {
      ok: false,
      error: toFriendlyUpstreamError(error?.message, "Could not load schedule right now."),
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
      cache: "no-store",
      ...(signal ? { signal } : {}),
    });
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      return {
        ok: false,
        error: toFriendlyUpstreamError(
          payload?.error || payload?.raw || `Server responded with ${response.status} ${response.statusText}`,
          "Could not load events right now."
        ),
      };
    }

    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return { ok: true, data: rows };
  } catch (error) {
    return {
      ok: false,
      error: toFriendlyUpstreamError(error?.message, "Could not load events right now."),
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
      cache: "no-store",
      ...(signal ? { signal } : {}),
    });
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      return {
        ok: false,
        error: toFriendlyUpstreamError(
          payload?.error || payload?.raw || `Server responded with ${response.status} ${response.statusText}`,
          "Could not load speakers right now."
        ),
      };
    }

    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return { ok: true, data: rows };
  } catch (error) {
    return {
      ok: false,
      error: toFriendlyUpstreamError(error?.message, "Could not load speakers right now."),
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
      return {
        ok: false,
        error: toFriendlyUpstreamError(checkError, "Could not verify email right now."),
      };
    }

    return { ok: true, exists: payload?.data?.exists === true };
  } catch (error) {
    return {
      ok: false,
      error: toFriendlyUpstreamError(error?.message, "Could not verify email right now."),
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
      return {
        ok: false,
        error: toFriendlyUpstreamError(errorMessage, "Could not submit registration right now."),
      };
    }

    return { ok: true, data: payload?.data ?? payload };
  } catch (error) {
    return {
      ok: false,
      error: toFriendlyUpstreamError(
        error?.message,
        "Could not submit registration right now."
      ),
    };
  }
}
