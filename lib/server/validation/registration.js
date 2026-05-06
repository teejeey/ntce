import { COMPLETE_EMAIL_PATTERN } from "../../emailPatterns";
import { REGISTRATION_REQUIRED_FIELDS_MESSAGE } from "../../registrationMessages";
import { REGISTRATION_ATTENDANCE_OPTIONS } from "../../registrationAttendanceOptions";
import { REGISTRATION_TOPIC_OPTIONS } from "../../registrationTopicOptions";

const LIMITS = {
  fullName: 200,
  email: 254,
  mobileNumber: 40,
  organization: 200,
  designation: 120,
  attendance: 120,
  topicInterestItem: 280,
  message: 5000,
};
const PHONE_PATTERN = /^[+\d][\d\s().-]{6,24}$/;

const ALLOWED_ATTENDANCE = new Set(REGISTRATION_ATTENDANCE_OPTIONS);
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
  const attendance = trimOrEmpty(body.attendance);
  const topicInterest = Array.isArray(body.topicInterest)
    ? body.topicInterest.map((item) => trimOrEmpty(item)).filter(Boolean)
    : [];
  const message = trimOrEmpty(body.message);
  const website = trimOrEmpty(body.website);

  if (!fullName || !email || !mobileNumber || !organization || !designation || !attendance) {
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
    tooLong("Attendance", attendance, LIMITS.attendance),
    tooLong("Message", message, LIMITS.message),
  ].filter(Boolean);

  if (checks.length > 0) {
    return { ok: false, error: checks[0] };
  }

  if (!COMPLETE_EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "email format is invalid." };
  }
  if (!PHONE_PATTERN.test(mobileNumber)) {
    return { ok: false, error: "mobile number format is invalid." };
  }
  // Honeypot: bots often fill hidden fields.
  if (website) {
    return { ok: false, error: "Request rejected." };
  }

  if (!ALLOWED_ATTENDANCE.has(attendance)) {
    return { ok: false, error: "attendance must be one of the allowed options." };
  }

  if (attendance === "Selected Session" && topicInterest.length === 0) {
    return {
      ok: false,
      error: "At least one topic interest is required when attendance is Selected Session.",
    };
  }

  if (topicInterest.some((topic) => !ALLOWED_TOPICS.has(topic))) {
    return { ok: false, error: "topic interest contains unsupported option(s)." };
  }

  const invalidLen = topicInterest.find(
    (topic) => topic.length > LIMITS.topicInterestItem
  );
  if (invalidLen) {
    return {
      ok: false,
      error: `Topic interest item exceeds maximum length (${LIMITS.topicInterestItem} characters).`,
    };
  }

  return {
    ok: true,
    values: {
      fullName,
      email,
      mobileNumber,
      organization,
      designation,
      attendance,
      topicInterest,
      message,
      website,
    },
  };
}
