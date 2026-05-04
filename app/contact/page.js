import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Us"
        subtitle="Get in touch with the NTCE organizing team"
      />

      <main className="inner-main">
        <section className="container sponsors-page">
          <div className="form-intro">
            <p className="section-tag">Reach Out</p>
            <h2>We are here to help</h2>
            <p>
              For registrations, sponsorships, speaker opportunities, and media support, use the
              contact details below.
            </p>
          </div>

          <div className="sponsor-page-grid">
            <article className="sponsor-item">
              <h3>Email</h3>
              <p>ntce@bt.bt</p>
            </article>
            {/* <article className="sponsor-item">
              <h3>Phone</h3>
              <p>+975 2 123 456</p>
            </article> */}
            <article className="sponsor-item">
              <h3>Address</h3>
              <p>Thimphu, Bhutan</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
