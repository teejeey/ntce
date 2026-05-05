"use client";

import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

export default function SponsorsPage() {
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
          <div className="partner-group">
            <h3>Supported by;</h3>
            <div className="sponsor-page-grid">
              <article className="sponsor-item logo-item tier-host">
                <img src="/rgob.png" alt="Bhutan Telecom logo" />
              </article>
            </div>
          </div>
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
              <h4>Platinum Sponsor</h4>
              <div className="sponsor-page-grid">
                <article className="sponsor-item logo-item tier-platinum">
                  <img src="/ericsson.png" alt="Ericsson logo" />
                </article>
              </div>
            </div>

            <div className="tier-section">
              <h4>Gold Sponsor</h4>
              <div className="sponsor-page-grid">
                <article className="sponsor-item logo-item tier-gold">
                  <img src="/ciena.png" alt="Ciena logo" />
                </article>
                <article className="sponsor-item logo-item tier-gold">
                  <img src="/tejas.png" alt="Tejas Networks logo" />
                </article>
              </div>
            </div>

            <div className="tier-section">
              <h4>Silver Sponsor</h4>
              <div className="sponsor-page-grid">
                <article className="sponsor-item logo-item tier-silver">
                  <img src="/cisco.png" alt="Cisco logo" />
                </article>
              </div>
            </div>

            <div className="tier-section">
              <h4>Bronze Sponsor</h4>
              <div className="sponsor-page-grid">
                <article className="sponsor-item logo-item tier-bronze">
                  <img src="/dhi.png" alt="DHI logo" />
                </article>
                <article className="sponsor-item logo-item tier-bronze">
                  <img src="/nokia.png" alt="Nokia logo" />
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
