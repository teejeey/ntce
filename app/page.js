import Link from "next/link";
import Countdown from "../components/Countdown";
import Footer from "../components/Footer";
import HomePageDynamic from "../components/HomePageDynamic";
import PageHero from "../components/PageHero";

export default function HomePage() {
  return (
    <>
      <PageHero
        variant="home"
        eyebrow="Thimphu, Bhutan"
        title={
          <>
            National Technology
            <br />
            Conference & Exhibition 2026
          </>
        }
        subtitle="Fri, 15 May - Sun, 17 May, 2026"
      >
        <Link className="btn btn-primary" href="/register">
          Register For Conference
        </Link>
      </PageHero>

      <main>
        <section className="about container">
          <div className="about-image-card">
            <img
              src="/conference1.jpg"
              alt="Conference keynote session"
            />
            <div className="about-countdown-stack">
              <div className="countdown-meta">
                <p className="countdown-meta-date">Fri, 15 May - Sun, 17 May, 2026</p>
                <p className="countdown-meta-venue">Royal Textile Academy (RTA), Thimphu, Bhutan</p>
              </div>
              <Countdown />
            </div>
          </div>
          <div className="about-content">
            <p className="section-tag">About NTCE</p>
            <h2>Welcome to Bhutan&apos;s Biggest Technology Event</h2>
            <p>
              The National Technology Conference & Exhibition (NTCE) 2026 is Bhutan’s premier national platform dedicated 
              to advancing digital transformation, innovation, and strategic collaboration across the country’s technology 
              ecosystem. Jointly organized by Bhutan Telecom Limited and the GovTech Agency, NTCE reflects a shared national 
              vision to accelerate Bhutan’s transition into a digitally empowered, innovation-driven, and knowledge-based economy.
            </p>
            <Link className="btn btn-outline-dark" href="/about">
              Learn More
            </Link>
          </div>
        </section>

        <HomePageDynamic />

        <section className="register">
          <div className="container register-content">
            <h2>Ready to join NTCE 2026?</h2>
            <p>Secure your place and connect with Bhutan&apos;s tech ecosystem.</p>
            <Link className="btn btn-primary" href="/register">
              Register Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
