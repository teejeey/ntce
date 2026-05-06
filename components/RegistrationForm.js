"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { checkEmailExistsViaGas, submitRegistrationViaGas } from "../lib/gasWebApp";
import { REGISTRATION_ATTENDANCE_OPTIONS } from "../lib/registrationAttendanceOptions";
import { COMPLETE_EMAIL_PATTERN } from "../lib/emailPatterns";
import { REGISTRATION_TOPIC_OPTIONS } from "../lib/registrationTopicOptions";
import RegistrationPreviewModal from "./registration/RegistrationPreviewModal";
import RegistrationSuccessModal from "./registration/RegistrationSuccessModal";

function isCompleteEmail(value) {
  return COMPLETE_EMAIL_PATTERN.test(String(value || "").trim());
}

function createRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const initialForm = {
  fullName: "",
  email: "",
  mobileNumber: "",
  organization: "",
  designation: "",
  attendance: "",
  topicInterest: [],
  message: "",
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [emailCheck, setEmailCheck] = useState({ checking: false, error: "" });
  const [requestId, setRequestId] = useState(() => createRequestId());
  const abortRef = useRef(null);
  const latestTrimmedEmailRef = useRef("");

  const emailTrimmed = String(formData.email || "").trim();
  latestTrimmedEmailRef.current = emailTrimmed;

  function onChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => {
      if (name === "attendance" && value !== "Selected Session") {
        return { ...prev, attendance: value, topicInterest: [] };
      }
      if (name === "topicInterest" && type === "checkbox") {
        const set = new Set(prev.topicInterest);
        if (checked) set.add(value);
        else set.delete(value);
        return { ...prev, topicInterest: Array.from(set) };
      }
      return { ...prev, [name]: value };
    });
    if (name === "email") {
      setEmailCheck({ checking: false, error: "" });
    }
  }

  const runEmailCheck = useCallback(async (emailParam) => {
    const email = String(emailParam || "").trim();
    if (!email || !isCompleteEmail(email)) {
      setEmailCheck({ checking: false, error: "" });
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setEmailCheck({ checking: true, error: "" });

    try {
      const result = await checkEmailExistsViaGas(email, { signal: ac.signal });
      if (ac.signal.aborted) return;
      if (!result.ok) throw new Error(result.error || "Could not verify email.");
      if (latestTrimmedEmailRef.current !== email) return;

      if (result.exists === true) {
        setEmailCheck({ checking: false, error: "This email is already registered." });
        return;
      }

      setEmailCheck({ checking: false, error: "" });
    } catch (error) {
      if (error.name === "AbortError") return;
      if (latestTrimmedEmailRef.current !== email) return;
      setEmailCheck({ checking: false, error: "" });
    }
  }, []);

  useEffect(() => {
    const trimmed = String(formData.email || "").trim();
    if (!trimmed || !isCompleteEmail(trimmed)) {
      abortRef.current?.abort();
      setEmailCheck({ checking: false, error: "" });
      return;
    }

    const timerId = window.setTimeout(() => {
      runEmailCheck(trimmed);
    }, 420);

    return () => {
      window.clearTimeout(timerId);
      abortRef.current?.abort();
    };
  }, [formData.email, runEmailCheck]);

  async function onSubmit(event) {
    event.preventDefault();
    if (!formData.attendance) {
      setStatus({
        type: "error",
        message: "Please choose attendance.",
      });
      return;
    }
    if (
      formData.attendance === "Selected Session" &&
      (!Array.isArray(formData.topicInterest) || formData.topicInterest.length === 0)
    ) {
      setStatus({
        type: "error",
        message: "Please select at least one topic interest.",
      });
      return;
    }
    if (emailTrimmed && !isCompleteEmail(emailTrimmed)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    if (emailCheck.checking || emailCheck.error) {
      if (emailCheck.error) setStatus({ type: "error", message: emailCheck.error });
      return;
    }
    setStatus({ type: "", message: "" });
    setShowPreview(true);
  }

  async function confirmSubmit() {
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const result = await submitRegistrationViaGas({
        ...formData,
        requestId,
        website: "",
        topicInterest:
          formData.attendance === "Selected Session"
            ? formData.topicInterest
            : [],
      });

      if (!result.ok) {
        throw new Error(result.error || "Failed to submit registration.");
      }

      setStatus({ type: "", message: "" });
      setFormData(initialForm);
      setRequestId(createRequestId());
      setShowPreview(false);
      setShowSuccessModal(true);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const submitDisabled = submitting || emailCheck.checking || Boolean(emailCheck.error);
  const submitHoverTitle = submitDisabled
    ? emailCheck.checking
      ? "Verifying your email..."
      : emailCheck.error || "Please wait..."
    : "";

  return (
    <>
      <form className="register-form" onSubmit={onSubmit}>
      <label>
        Full Name
        <input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Email Address
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={onChange}
          required
          aria-busy={emailCheck.checking}
        />
        {emailCheck.checking ? <small className="field-note">Checking email...</small> : null}
        {emailCheck.error ? <small className="field-error">{emailCheck.error}</small> : null}
        {!emailCheck.checking && !emailCheck.error && emailTrimmed && !isCompleteEmail(emailTrimmed) ? (
          <small className="field-note">
            Finish a complete email address; we verify it automatically.
          </small>
        ) : null}
      </label>
      <label>
        Mobile Number
        <input
          type="tel"
          name="mobileNumber"
          placeholder="+975..."
          value={formData.mobileNumber}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Organization
        <input
          type="text"
          name="organization"
          placeholder="Company / Institution"
          value={formData.organization}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Designation
        <input
          type="text"
          name="designation"
          placeholder="Your job title"
          value={formData.designation}
          onChange={onChange}
          required
        />
      </label>
      <label>
        I want to attend
        <select
          name="attendance"
          value={formData.attendance}
          onChange={onChange}
          required
        >
          <option value="" disabled>
            Select attendance
          </option>
          {REGISTRATION_ATTENDANCE_OPTIONS.map((attendance) => (
            <option key={attendance} value={attendance}>
              {attendance}
            </option>
          ))}
        </select>
      </label>
      {formData.attendance === "Selected Session" ? (
        <div className="register-topic-group">
          <p className="register-topic-label">Topic Interest (Selected Session)</p>
          <div className="registration-checkbox-grid">
            {REGISTRATION_TOPIC_OPTIONS.map((topic) => (
              <label key={topic} className="registration-checkbox-item">
                <input
                  type="checkbox"
                  name="topicInterest"
                  value={topic}
                  checked={formData.topicInterest.includes(topic)}
                  onChange={onChange}
                />
                <span>{topic}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}
      <label>
        Remarks (Optional)
        <textarea
          rows="4"
          name="message"
          placeholder="Any note or request"
          value={formData.message}
          onChange={onChange}
        />
      </label>
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        value=""
        onChange={() => {}}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {status.message ? (
        <p className={`form-status ${status.type === "error" ? "error" : "success"}`}>
          {status.message}
        </p>
      ) : null}

      {!showPreview ? (
        <span
          className={
            submitDisabled && submitHoverTitle
              ? "register-submit-hint register-submit-hint--tooltip"
              : "register-submit-hint"
          }
          {...(submitDisabled && submitHoverTitle ? { title: submitHoverTitle } : {})}
        >
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitDisabled}
            aria-disabled={submitDisabled}
          >
            Submit Registration
          </button>
        </span>
      ) : null}
      </form>

      <RegistrationPreviewModal
        open={showPreview}
        formData={formData}
        submitting={submitting}
        onClose={() => setShowPreview(false)}
        onConfirm={confirmSubmit}
      />

      <RegistrationSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
