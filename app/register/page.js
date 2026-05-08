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
            {/* <p>Please fill in your details to submit your registration.</p> */}
            <p><strong>Limited seats are available for the conference. Individual registration is required and will close on 13 May 2026 at 1700 hrs. </strong></p>
            <p>No registration is required for the exhibition.</p>
          </div>
          <RegistrationForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
