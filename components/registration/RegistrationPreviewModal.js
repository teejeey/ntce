"use client";

export default function RegistrationPreviewModal({
  open,
  formData,
  submitting,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div
      className="preview-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (submitting) return;
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="preview-modal-header">
          <p id="preview-title" className="section-tag preview-modal-title">
            Preview your details
          </p>
          <button
            type="button"
            className="preview-modal-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close preview"
          >
            ×
          </button>
        </header>
        <div className="form-preview-grid">
          <p>
            <strong>Full Name:</strong> {formData.fullName}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Mobile Number:</strong> {formData.mobileNumber}
          </p>
          <p>
            <strong>Organization:</strong> {formData.organization}
          </p>
          <p>
            <strong>Designation:</strong> {formData.designation}
          </p>
          <p>
            <strong>Attendance:</strong> {formData.attendance}
          </p>
          <div>
            <p>
              <strong>Topic Interest:</strong>{" "}
              {formData.attendance === "Selected Session" &&
              formData.topicInterest.length > 0
                ? ""
                : "-"}
            </p>
            {formData.attendance === "Selected Session" && formData.topicInterest.length > 0 ? (
              <ol>
                {formData.topicInterest.map((topic, index) => (
                  <li key={`${topic}-${index}`}>{topic}</li>
                ))}
              </ol>
            ) : null}
          </div>
          <p>
            <strong>Message:</strong> {formData.message || "-"}
          </p>
        </div>
        <div className="form-preview-actions">
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={onClose}
            disabled={submitting}
          >
            Edit Details
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Yes, Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
