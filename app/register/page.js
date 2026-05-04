import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import RegistrationForm from "../../components/RegistrationForm";

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Join the Conference"
        title="Registration"
        subtitle="Reserve your seat for NTCE 2026"
      />

      <main className="inner-main">
        <section className="container form-section">
          <div className="form-intro">
            <p className="section-tag">Registration Form</p>
            <h2>Attend NTCE 2026 in Thimphu</h2>
            <p>Please fill in your details to submit your registration.</p>
          </div>
          <RegistrationForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
