import { COMPLETE_EMAIL_PATTERN } from "../../emailPatterns";
import { REGISTRATION_REQUIRED_FIELDS_MESSAGE } from "../../registrationMessages";
import { REGISTRATION_TOPIC_OPTIONS } from "../../registrationTopicOptions";

const LIMITS = {
  fullName: 200,
  email: 254,
  mobileNumber: 40,
  organization: 200,
  designation: 120,
  topicInterest: 120,
  message: 5000,
};

const ALLOWED_TOPICS = new Set(REGISTRATION_TOPIC_OPTIONS);

function trimOrEmpty(value) {
  return String(value ?? "").trim();
}

function tooLong(field, value, max) {
  if (value.length > max) {
    return `${field} exceeds maximum length (${max} characters).`;
  }
  return null;
}

export function validateRegistrationBody(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const fullName = trimOrEmpty(body.fullName);
  const email = trimOrEmpty(body.email);
  const mobileNumber = trimOrEmpty(body.mobileNumber);
  const organization = trimOrEmpty(body.organization);
  const designation = trimOrEmpty(body.designation);
  const topicInterest = trimOrEmpty(body.topicInterest);
  const message = trimOrEmpty(body.message);

  if (!fullName || !email || !mobileNumber || !organization || !designation || !topicInterest) {
    return {
      ok: false,
      error: REGISTRATION_REQUIRED_FIELDS_MESSAGE,
    };
  }

  const checks = [
    tooLong("Full name", fullName, LIMITS.fullName),
    tooLong("Email", email, LIMITS.email),
    tooLong("Mobile number", mobileNumber, LIMITS.mobileNumber),
    tooLong("Organization", organization, LIMITS.organization),
    tooLong("Designation", designation, LIMITS.designation),
    tooLong("Topic interest", topicInterest, LIMITS.topicInterest),
    tooLong("Message", message, LIMITS.message),
  ].filter(Boolean);

  if (checks.length > 0) {
    return { ok: false, error: checks[0] };
  }

  if (!COMPLETE_EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "email format is invalid." };
  }

  if (!ALLOWED_TOPICS.has(topicInterest)) {
    return { ok: false, error: "topic interest must be one of the allowed options." };
  }

  return {
    ok: true,
    values: {
      fullName,
      email,
      mobileNumber,
      organization,
      designation,
      topicInterest,
      message,
    },
  };
}
