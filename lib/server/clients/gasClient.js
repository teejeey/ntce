import { getGasWebAppUrl } from "../../gasEnv";
import { parseJsonResponse } from "../../parseJsonResponse";
import { GAS_TIMEOUT_MS } from "../config/timeouts";
import { logGasRequest, logGasResult } from "../logger";
import { mergeTimeoutSignal } from "./gasSignals";

export { parseJsonResponse };

function mapNetworkError(error, fallback) {
  const name = error?.name || "";
  const msg = String(error?.message || "").toLowerCase();
  if (name === "TimeoutError" || msg.includes("timeout")) {
    return "Request timed out waiting for Google Apps Script.";
  }
  if (name === "AbortError" || msg.includes("abort")) {
    return "Request to Google Apps Script was aborted.";
  }
  return error?.message || fallback;
}

async function fetchWithGasTimeout(url, init, timeoutMs, userSignal) {
  const signal = mergeTimeoutSignal(timeoutMs, userSignal);
  return fetch(url, { ...init, signal });
}

/**
 * Low-level calls to the Google Apps Script web app.
 */
export async function gasFetchSchedule(options = {}) {
  const endpoint = getGasWebAppUrl();
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : GAS_TIMEOUT_MS.schedule;
  const started = Date.now();
  const operation = "schedule";

  if (!endpoint) {
    return {
      ok: false,
      error:
        "Backend is not configured yet. Add GAS_WEB_APP_URL or NEXT_PUBLIC_GAS_WEB_APP_URL to your environment.",
    };
  }

  logGasRequest(operation, { timeoutMs });

  try {
    const url = `${endpoint}?action=schedule`;
    const response = await fetchWithGasTimeout(
      url,
      { method: "GET", cache: "no-store" },
      timeoutMs,
      options.signal
    );
    const text = await response.text();

    let payload = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text };
    }

    if (!response.ok) {
      const errorMessage =
        payload?.error ||
        payload?.raw ||
        `Apps Script responded with ${response.status} ${response.statusText}`;
      const out = { ok: false, error: errorMessage };
      logGasResult(operation, started, out);
      return out;
    }

    if (payload?.success === false) {
      const out = {
        ok: false,
        error: payload?.error || "Google Apps Script rejected the schedule request.",
      };
      logGasResult(operation, started, out);
      return out;
    }

    const data = payload?.data || payload;
    if (data?.raw && String(data.raw).includes("Script function not found: doGet")) {
      const out = {
        ok: false,
        error:
          "Apps Script is missing doGet(). Update Apps Script code with doGet and redeploy the web app.",
      };
      logGasResult(operation, started, out);
      return out;
    }

    const day1 = Array.isArray(data.day1) ? data.day1 : [];
    const day2 = Array.isArray(data.day2) ? data.day2 : [];
    const day3 = Array.isArray(data.day3) ? data.day3 : [];
    /** Optional: new rows for Conference Day 2 tab after former day3 content moved to WTISD. */
    const day4 = Array.isArray(data.day4) ? data.day4 : [];

    const out = { ok: true, data: { day1, day2, day3, day4 } };
    logGasResult(operation, started, out);
    return out;
  } catch (error) {
    const out = { ok: false, error: mapNetworkError(error, "Could not load schedule.") };
    logGasResult(operation, started, out);
    return out;
  }
}

export async function gasFetchEvents(options = {}) {
  const endpoint = getGasWebAppUrl();
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : GAS_TIMEOUT_MS.events;
  const started = Date.now();
  const operation = "events";

  if (!endpoint) {
    return {
      ok: false,
      error:
        "Backend is not configured yet. Add GAS_WEB_APP_URL or NEXT_PUBLIC_GAS_WEB_APP_URL to your environment.",
    };
  }

  logGasRequest(operation, { timeoutMs });

  try {
    const response = await fetchWithGasTimeout(
      `${endpoint}?action=events`,
      { method: "GET", cache: "no-store" },
      timeoutMs,
      options.signal
    );
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      const errorMessage =
        payload?.error ||
        payload?.raw ||
        `Apps Script responded with ${response.status} ${response.statusText}`;
      const out = { ok: false, error: errorMessage };
      logGasResult(operation, started, out);
      return out;
    }

    const rows = Array.isArray(payload?.data) ? payload.data : [];
    const out = { ok: true, data: rows };
    logGasResult(operation, started, out);
    return out;
  } catch (error) {
    const out = { ok: false, error: mapNetworkError(error, "Could not load events.") };
    logGasResult(operation, started, out);
    return out;
  }
}

export async function gasFetchSpeakers(options = {}) {
  const endpoint = getGasWebAppUrl();
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : GAS_TIMEOUT_MS.speakers;
  const started = Date.now();
  const operation = "speakers";

  if (!endpoint) {
    return {
      ok: false,
      error:
        "Backend is not configured yet. Add GAS_WEB_APP_URL or NEXT_PUBLIC_GAS_WEB_APP_URL to your environment.",
    };
  }

  logGasRequest(operation, { timeoutMs });

  try {
    const response = await fetchWithGasTimeout(
      `${endpoint}?action=speakers`,
      { method: "GET", cache: "no-store" },
      timeoutMs,
      options.signal
    );
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      const errorMessage =
        payload?.error ||
        payload?.raw ||
        `Apps Script responded with ${response.status} ${response.statusText}`;
      const out = { ok: false, error: errorMessage };
      logGasResult(operation, started, out);
      return out;
    }

    const rows = Array.isArray(payload?.data) ? payload.data : [];
    const out = { ok: true, data: rows };
    logGasResult(operation, started, out);
    return out;
  } catch (error) {
    const out = { ok: false, error: mapNetworkError(error, "Could not load speakers.") };
    logGasResult(operation, started, out);
    return out;
  }
}

export async function gasCheckEmail(email, options = {}) {
  const endpoint = getGasWebAppUrl();
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : GAS_TIMEOUT_MS.checkEmail;
  const started = Date.now();
  const operation = "checkEmail";

  if (!endpoint) {
    return {
      ok: false,
      error:
        "Backend is not configured yet. Add GAS_WEB_APP_URL or NEXT_PUBLIC_GAS_WEB_APP_URL to your environment.",
    };
  }

  const trimmed = String(email || "").trim();
  const checkUrl = `${endpoint}?action=checkEmail&email=${encodeURIComponent(trimmed)}`;

  logGasRequest(operation, { timeoutMs, email: trimmed });

  try {
    const response = await fetchWithGasTimeout(
      checkUrl,
      { method: "GET", cache: "no-store" },
      timeoutMs,
      options.signal
    );
    const payload = await parseJsonResponse(response);

    if (!response.ok || payload?.success === false) {
      const checkError =
        payload?.error ||
        payload?.raw ||
        `Apps Script responded with ${response.status} ${response.statusText}`;
      const out = { ok: false, error: checkError };
      logGasResult(operation, started, out);
      return out;
    }

    const out = { ok: true, exists: payload?.exists === true };
    logGasResult(operation, started, out);
    return out;
  } catch (error) {
    const out = { ok: false, error: mapNetworkError(error, "Could not check email.") };
    logGasResult(operation, started, out);
    return out;
  }
}

export async function gasPostRegistration(body, options = {}) {
  const endpoint = getGasWebAppUrl();
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : GAS_TIMEOUT_MS.postRegistration;
  const started = Date.now();
  const operation = "postRegistration";

  if (!endpoint) {
    return {
      ok: false,
      error:
        "Backend is not configured yet. Add GAS_WEB_APP_URL or NEXT_PUBLIC_GAS_WEB_APP_URL to your environment.",
    };
  }

  logGasRequest(operation, { timeoutMs });

  try {
    const response = await fetchWithGasTimeout(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      },
      timeoutMs,
      options.signal
    );

    const payload = await parseJsonResponse(response);

    if (!response.ok) {
      const errorMessage =
        payload?.error ||
        payload?.raw ||
        `Apps Script responded with ${response.status} ${response.statusText}`;
      const out = { ok: false, error: errorMessage };
      logGasResult(operation, started, out);
      return out;
    }

    if (payload?.success === false) {
      const out = {
        ok: false,
        error: payload?.error || "Google Apps Script rejected the request.",
      };
      logGasResult(operation, started, out);
      return out;
    }

    const out = { ok: true, data: payload };
    logGasResult(operation, started, out);
    return out;
  } catch (error) {
    const out = {
      ok: false,
      error: mapNetworkError(error, "Could not process registration submission."),
    };
    logGasResult(operation, started, out);
    return out;
  }
}
