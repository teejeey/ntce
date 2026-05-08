import { apiFailure, apiSuccess } from "../http/apiEnvelope";
import { jsonWithCors } from "../http/apiResponse";
import { getRequestSearchParam } from "../http/requestQuery";
import {
  gasErrorHttpStatus,
  sanitizeUpstreamError,
} from "../http/upstreamStatus";
import { logValidationFailure } from "../logger";
import { REGISTRATION_REQUIRED_FIELDS_MESSAGE } from "../../registrationMessages";
import { checkEmail, submitRegistration } from "../services/registrationService";
import { validateEmailQuery } from "../validation/email";
import { validateRegistrationBody } from "../validation/registration";
import { enforceRateLimit } from "../security/rateLimit";
import { consumeIdempotencyKey } from "../security/idempotency";
import { isOriginAllowed, splitOriginPatterns } from "../security/originMatch";

const MISSING_EMAIL_QUERY_MSG = "email query parameter is required.";

function isTrustedCheckEmailCaller(request) {
  const origin = String(request.headers.get("origin") || "").trim();
  if (!origin) return true;

  let sameOrigin = "";
  try {
    sameOrigin = new URL(request.url).origin;
  } catch {
    sameOrigin = "";
  }
  if (sameOrigin && origin === sameOrigin) return true;

  const trusted = splitOriginPatterns(process.env.CHECK_EMAIL_TRUSTED_ORIGINS || "");
  return isOriginAllowed(origin, trusted);
}

export async function handleGetCheckEmail(request) {
  try {
    const rl = enforceRateLimit(request, "registration-check-email", {
      limit: 20,
      windowMs: 60_000,
    });
    if (!rl.allowed) {
      return jsonWithCors(
        apiFailure("Too many requests. Please try again shortly."),
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
        request
      );
    }

    const rawEmail = getRequestSearchParam(request, "email");
    const parsed = validateEmailQuery(rawEmail);
    if (!parsed.ok) {
      if (parsed.error !== MISSING_EMAIL_QUERY_MSG) {
        logValidationFailure("check-email", parsed.error);
      }
      return jsonWithCors(apiFailure(parsed.error), { status: 400 }, request);
    }

    const result = await checkEmail(parsed.email);
    if (result.success) {
      if (!isTrustedCheckEmailCaller(request)) {
        return jsonWithCors(apiSuccess({ exists: false }), { status: 200 }, request);
      }
      return jsonWithCors(apiSuccess(result.data), { status: 200 }, request);
    }
    return jsonWithCors(
      apiFailure(sanitizeUpstreamError(result.error, "Could not verify email right now.")),
      { status: gasErrorHttpStatus(result.error) },
      request
    );
  } catch (err) {
    return jsonWithCors(
      apiFailure("Could not process the request."),
      { status: 500 },
      request
    );
  }
}

export async function handlePostRegistration(request) {
  try {
    const ipLimit = enforceRateLimit(request, "registration-post-ip", {
      limit: 8,
      windowMs: 60_000,
    });
    if (!ipLimit.allowed) {
      return jsonWithCors(
        apiFailure("Too many requests. Please try again shortly."),
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSec) } },
        request
      );
    }

    let body = {};
    try {
      body = await request.json();
    } catch {
      return jsonWithCors(
        apiFailure("Request body must be valid JSON."),
        { status: 400 },
        request
      );
    }

    const validated = validateRegistrationBody(body);
    if (!validated.ok) {
      logValidationFailure("registration", validated.error);
      return jsonWithCors(apiFailure(validated.error), { status: 400 }, request);
    }

    const emailLimit = enforceRateLimit(request, "registration-post-email", {
      limit: 3,
      windowMs: 60_000,
      identifier: validated.values.email,
    });
    if (!emailLimit.allowed) {
      return jsonWithCors(
        apiFailure("Too many requests. Please try again shortly."),
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfterSec) } },
        request
      );
    }

    const idempotencyKey = request.headers.get("x-idempotency-key") || body.requestId;
    const idem = consumeIdempotencyKey(idempotencyKey);
    if (!idem.ok) {
      return jsonWithCors(
        apiFailure("Duplicate submission detected. Please wait."),
        { status: 409, headers: { "Retry-After": String(idem.retryAfterSec) } },
        request
      );
    }

    const result = await submitRegistration(validated.values);

    if (result.success) {
      return jsonWithCors(apiSuccess(result.data ?? null), { status: 200 }, request);
    }

    if (result.conflict) {
      return jsonWithCors(apiFailure(result.error), { status: 409 }, request);
    }

    const isValidation =
      typeof result.error === "string" &&
      (result.error === REGISTRATION_REQUIRED_FIELDS_MESSAGE ||
        result.error.includes("Full name, email, mobile number"));

    return jsonWithCors(
      apiFailure(
        sanitizeUpstreamError(result.error, "Could not process registration at the moment.")
      ),
      {
        status: isValidation ? 400 : gasErrorHttpStatus(result.error),
      },
      request
    );
  } catch (err) {
    return jsonWithCors(
      apiFailure("Could not process registration at the moment."),
      { status: 500 },
      request
    );
  }
}
