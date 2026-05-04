import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About NTCE"
        title="National Technology Conference & Exhibition"
        subtitle="A flagship platform for Bhutan's digital future"
      />

      <main className="inner-main">
        <section className="container sponsors-page">
          <div className="form-intro">
            <p className="section-tag">Overview</p>
            <h2>About NTCE 2026</h2>
            <p>
              The National Technology Conference & Exhibition (NTCE) 2026 is Bhutan&apos;s premier
              platform for innovation, collaboration, and technological advancement in the digital
              ecosystem. Jointly organized by Bhutan Telecom Ltd. and GovTech Agency, NTCE brings
              together leaders from government, industry, and global technology providers to shape
              the future of connectivity in Bhutan.
            </p>
            <p>
              Held from 15-17 May 2026 at the Royal Textile Museum, Thimphu, NTCE 2026 is centered
              around the theme:
            </p>
            <p>
              <strong>&ldquo;Driving Digital Transformation for a Sustainable Bhutan&rdquo;</strong>
            </p>
            <p>
              This theme reflects a national commitment to accelerating innovation and achieving a
              10X transformation across the Royal Government of Bhutan (RGoB) and Druk Holding and
              Investments (DHI).
            </p>
          </div>

          <h2>Our Vision</h2>
          <p>NTCE 2026 aims to serve as a strategic national platform to:</p>
          <ul className="footer-links">
            <li>Showcase cutting-edge technologies shaping the future</li>
            <li>Foster collaboration between public and private sectors</li>
            <li>Accelerate Bhutan&apos;s digital transformation journey</li>
            <li>Support the vision of a sustainable and digitally empowered Bhutan</li>
          </ul>

          <h2>What to Expect</h2>

          <h3>1. Inaugural Programme</h3>
          <p>
            The event begins with a formal inaugural ceremony attended by distinguished
            dignitaries, including government leaders and industry executives. The programme
            includes traditional ceremonies, keynote addresses, and the official opening of the
            exhibition.
          </p>

          <h3>2. Conference &amp; Knowledge Sharing</h3>
          <p>
            The expo will host conference sessions and paper presentations where experts,
            policymakers, and industry leaders share insights on emerging technologies, digital
            policies, and Bhutan&apos;s future digital roadmap.
          </p>

          <h3>3. World Information Society Day (WISD)</h3>
          <p>
            On 17 May, NTCE aligns with World Information Society Day, reinforcing Bhutan&apos;s
            commitment to inclusive digital growth and global connectivity standards.
          </p>

          <h2>Why NTCE Matters</h2>
          <p>
            NTCE 2026 is more than an exhibition-it is a national movement toward digital
            transformation. It provides a unique opportunity to:
          </p>
          <ul className="footer-links">
            <li>Connect with industry leaders and innovators</li>
            <li>Explore real-world technology applications</li>
            <li>Strengthen public-private partnerships</li>
            <li>Contribute to Bhutan&apos;s digital future</li>
          </ul>

          <h2>Join Us</h2>
          <p>
            NTCE 2026 invites stakeholders, innovators, and leaders to be part of this
            transformative journey. Together, we can drive meaningful change and build a
            sustainable, connected, and digitally empowered Bhutan.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
