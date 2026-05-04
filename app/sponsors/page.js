"use client";

import { useState } from "react";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

export default function SponsorsPage() {
  const [activeTab, setActiveTab] = useState("sponsors");

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Our Sponsors"
        subtitle="Organizations enabling NTCE 2026"
      />

      <main className="inner-main">
        <section className="container sponsors-page">
          <p className="section-tag">Partners</p>
          <h2>Our Hosts and Sponsors - 2026</h2>

          <div className="schedule-tabs" style={{ marginTop: "0.6rem" }}>
            <button
              type="button"
              className={`schedule-tab ${activeTab === "sponsors" ? "active" : ""}`}
              onClick={() => setActiveTab("sponsors")}
            >
              Sponsors
            </button>
            <button
              type="button"
              className={`schedule-tab ${activeTab === "packages" ? "active" : ""}`}
              onClick={() => setActiveTab("packages")}
            >
              Sponsors Packages
            </button>
          </div>

          {activeTab === "sponsors" ? (
            <>
              <div className="partner-group">
                <h3>Host</h3>
                <div className="sponsor-page-grid">
                  <article className="sponsor-item logo-item tier-host">
                    <img src="/bt.png" alt="Bhutan Telecom logo" />
                  </article>
                  <article className="sponsor-item logo-item tier-host">
                    <img src="/govtech.png" alt="GovTech Bhutan logo" />
                  </article>
                </div>
              </div>

              <div className="partner-group">
                <h3>Sponsors</h3>
                <div className="tier-section">
                  <h4>Platinum Sponsors</h4>
                  <div className="sponsor-page-grid">
                    <article className="sponsor-item logo-item tier-platinum">
                      <img src="/ericsson.png" alt="Ericsson logo" />
                      {/* <p>Ericsson</p> */}
                    </article>
                  </div>
                </div>

                <div className="tier-section">
                  <h4>Gold Sponsors</h4>
                  <div className="sponsor-page-grid">
                    <article className="sponsor-item logo-item tier-gold">
                      <img src="/ciena.png" alt="Ciena logo" />
                      {/* <p>Ciena</p> */}
                    </article>
                    <article className="sponsor-item logo-item tier-gold">
                      <img src="/tejas.png" alt="Tejas Networks logo" />
                      {/* <p>Tejas</p> */}
                    </article>
                  </div>
                </div>

                <div className="tier-section">
                  <h4>Silver Sponsors</h4>
                  <div className="sponsor-page-grid">
                    <article className="sponsor-item logo-item tier-silver">
                      <img src="/cisco.png" alt="Cisco logo" />
                      {/* <p>Cisco</p> */}
                    </article>
                  </div>
                </div>

                <div className="tier-section">
                  <h4>Bronze Sponsors</h4>
                  <div className="sponsor-page-grid">
                    <article className="sponsor-item logo-item tier-bronze">
                      <img src="/nokia.png" alt="Nokia logo" />
                      {/* <p>Nokia</p> */}
                    </article>
                    <article className="sponsor-item logo-item tier-bronze">
                      <img src="/dhi.png" alt="DHI logo" />
                      {/* <p>DHI</p> */}
                    </article>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {activeTab === "packages" ? (
            <div className="partner-group">
              <article className="package-block">
                <h3>Platinum Sponsor - US$ 6,000.00</h3>
                <p>
                  Platinum sponsors will receive exclusive premium visibility and engagement
                  opportunities, including:
                </p>
                <ul className="footer-links">
                  <li>Complimentary prime exhibition booth space (priority location)</li>
                  <li>Airport VIP pick-up and drop-off services</li>
                  <li>Top-tier logo placement on all event banners, lanyards, and main stage backdrop</li>
                  <li>Special recognition during opening and closing ceremonies</li>
                  <li>Provision of a simple working lunch</li>
                  <li>
                    Three (3) speaking slots at the conference - Topics: AI, Cybersecurity, and
                    Trending Technologies - Duration: 20 minutes per session
                  </li>
                  <li>Opportunity for keynote or featured session placement</li>
                </ul>
              </article>

              <article className="package-block">
                <h3>Gold Sponsor - US$ 4,500.00</h3>
                <p>
                  Gold sponsors will receive high-visibility branding and engagement benefits,
                  including:
                </p>
                <ul className="footer-links">
                  <li>Complimentary exhibition booth space</li>
                  <li>Airport pick-up and drop-off services</li>
                  <li>Prominent logo placement on event banners and lanyards</li>
                  <li>Recognition during the event program</li>
                  <li>Provision of a simple working lunch</li>
                  <li>
                    Two (2) speaking slots at the conference - Topics: AI, Cybersecurity, and
                    Trending Technologies - Duration: 20 minutes per session
                  </li>
                </ul>
              </article>

              <article className="package-block">
                <h3>Silver Sponsor - US$ 4,000.00</h3>
                <p>Silver sponsors will receive standard participation and branding benefits, including:</p>
                <ul className="footer-links">
                  <li>Complimentary exhibition booth space</li>
                  <li>Airport pick-up and drop-off services</li>
                  <li>Logo placement on event banners and lanyards</li>
                  <li>Provision of a simple working lunch</li>
                  <li>
                    One (1) speaking slot at the conference - Topics: AI, Cybersecurity, and
                    Trending Technologies - Duration: 20 minutes
                  </li>
                </ul>
              </article>

              <article className="package-block">
                <h3>Bronze Sponsor - US$ 3,000.00</h3>
                <p>Bronze sponsors will receive standard participation and branding benefits, including:</p>
                <ul className="footer-links">
                  <li>Complimentary exhibition booth space</li>
                  <li>Airport pick-up and drop-off services</li>
                  <li>Logo placement on event banners and lanyards</li>
                  <li>Provision of a simple working lunch</li>
                  <li>
                    One (1) speaking slot at the conference - Topics: AI, Cybersecurity, and
                    Trending Technologies - Duration: 20 minutes
                  </li>
                </ul>
              </article>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
}
