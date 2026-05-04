import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Sponsors"
        title="Sponsorship Packages"
        subtitle="NTCE 2026 sponsorship opportunities"
      />

      <main className="inner-main">
        <section className="container sponsors-page">
          <p className="section-tag">Packages</p>
          <h2>Sponsorship Packages</h2>

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
                Two (2) speaking slots at the conference - Topics: AI, Cybersecurity, and Trending
                Technologies - Duration: 20 minutes per session
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
                One (1) speaking slot at the conference - Topics: AI, Cybersecurity, and Trending
                Technologies - Duration: 20 minutes
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
                One (1) speaking slot at the conference - Topics: AI, Cybersecurity, and Trending
                Technologies - Duration: 20 minutes
              </li>
            </ul>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
