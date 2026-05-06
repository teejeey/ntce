"use client";

export default function RegistrationSuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="preview-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="preview-modal registration-success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-success-title"
      >
        <p id="registration-success-title" className="section-tag">
          Thank you
        </p>
        <p className="success-modal-heading">
          <strong>Your registration is successful!</strong>
        </p>
        <p className="success-modal-text">
          You will receive a confirmation email with all event details prior to the event.
        </p>
        <div className="form-preview-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
