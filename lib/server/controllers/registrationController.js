import { apiFailure, apiSuccess } from "../http/apiEnvelope";
import { jsonWithCors } from "../http/apiResponse";
import { getRequestSearchParam } from "../http/requestQuery";
import {
  checkEmailQueryErrorStatus,
  gasErrorHttpStatus,
} from "../http/upstreamStatus";
import { logValidationFailure } from "../logger";
import { REGISTRATION_REQUIRED_FIELDS_MESSAGE } from "../../registrationMessages";
import { checkEmail, submitRegistration } from "../services/registrationService";
import { validateEmailQuery } from "../validation/email";
import { validateRegistrationBody } from "../validation/registration";

const MISSING_EMAIL_QUERY_MSG = "email query parameter is required.";

export async function handleGetCheckEmail(request) {
  try {
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
      return jsonWithCors(apiSuccess(result.data), { status: 200 }, request);
    }
    return jsonWithCors(
      apiFailure(result.error),
      { status: checkEmailQueryErrorStatus(result.error) },
      request
    );
  } catch (err) {
    const message = err?.message || "Unexpected error.";
    return jsonWithCors(apiFailure(message), { status: 500 }, request);
  }
}

export async function handlePostRegistration(request) {
  try {
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
      apiFailure(result.error),
      {
        status: isValidation ? 400 : gasErrorHttpStatus(result.error),
      },
      request
    );
  } catch (err) {
    const message = err?.message || "Unexpected error.";
    return jsonWithCors(apiFailure(message), { status: 500 }, request);
  }
}
