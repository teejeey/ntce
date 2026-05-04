import { gasCheckEmail, gasPostRegistration } from "../clients/gasClient";
import { getGasWebAppUrl } from "../../gasEnv";
import { REGISTRATION_REQUIRED_FIELDS_MESSAGE } from "../../registrationMessages";

/**
 * @param {string} email
 * @param {object} [options]
 */
export async function checkEmail(email, options = {}) {
  const trimmed = String(email || "").trim();
  if (!trimmed) {
    return {
      success: false,
      data: null,
      error: "email query parameter is required.",
    };
  }

  const endpoint = getGasWebAppUrl();
  if (!endpoint) {
    return {
      success: false,
      data: null,
      error:
        "Backend is not configured yet. Add GAS_WEB_APP_URL or NEXT_PUBLIC_GAS_WEB_APP_URL to your environment.",
    };
  }

  const result = await gasCheckEmail(trimmed, options);
  if (result.ok) {
    return { success: true, data: { exists: result.exists }, error: undefined };
  }
  return { success: false, data: null, error: result.error };
}

/**
 * @param {object} body — normalized fields from validateRegistrationBody
 * @param {object} [options]
 */
export async function submitRegistration(body, options = {}) {
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
      success: false,
      data: null,
      error: REGISTRATION_REQUIRED_FIELDS_MESSAGE,
      conflict: false,
    };
  }

  const endpoint = getGasWebAppUrl();
  if (!endpoint) {
    return {
      success: false,
      data: null,
      error:
        "Backend is not configured yet. Add GAS_WEB_APP_URL or NEXT_PUBLIC_GAS_WEB_APP_URL to your environment.",
      conflict: false,
    };
  }

  try {
    const dupResult = await gasCheckEmail(email, options);

    if (!dupResult.ok) {
      return {
        success: false,
        data: null,
        error: `Could not verify email uniqueness. ${dupResult.error}`,
        conflict: false,
      };
    }

    if (dupResult.exists === true) {
      return {
        success: false,
        data: null,
        error: "This email is already registered.",
        conflict: true,
      };
    }

    const postResult = await gasPostRegistration(
      {
        "Full Name": fullName,
        Email: email,
        "Mobile number": mobileNumber,
        Organization: organization,
        Designation: designation,
        Attendance: attendance,
        Topic_interest: Array.isArray(topicInterest) ? topicInterest.join(", ") : "",
        Topic_interest_array: JSON.stringify(Array.isArray(topicInterest) ? topicInterest : []),
        message: message || "",
      },
      options
    );

    if (!postResult.ok) {
      return {
        success: false,
        data: null,
        error: postResult.error,
        conflict: false,
      };
    }

    return {
      success: true,
      data: postResult.data ?? null,
      error: undefined,
      conflict: false,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error?.message || "Could not process registration submission.",
      conflict: false,
    };
  }
}
