"use client";

import { useState } from "react";

export default function ContactFloat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="contact-float-btn"
        onClick={() => setOpen(true)}
        aria-label="Open contact information"
      >
        Contact Us
      </button>

      {open ? (
        <div className="contact-float-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            className="contact-float-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-float-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="contact-float-header">
              <h3 id="contact-float-title">Contact Support</h3>
              <button
                type="button"
                className="contact-float-close"
                onClick={() => setOpen(false)}
                aria-label="Close contact information"
              >
                ×
              </button>
            </header>

            <div className="contact-float-body">
              <p>For registrations, sponsorships, speaking opportunities, and media support:</p>
              <p>
                <strong>Email:</strong> ntce@bt.bt
              </p>
              <p>
                <strong>Phone:</strong> +975 2 123 456
              </p>
              <p>
                <strong>Address:</strong> Thimphu, Bhutan
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
