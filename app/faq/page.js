import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

const faqs = [
  {
    question: "Who can attend NTCE 2026?",
    answer:
      "NTCE is open to professionals, students, startups, policymakers, academics, and technology enthusiasts.",
  },
  {
    question: "Is registration mandatory?",
    answer:
      "Yes. All participants must complete registration to receive event access details and session updates.",
  },
  {
    question: "Will there be opportunities for networking?",
    answer:
      "Yes. Dedicated networking breaks, partner booths, and industry meetups are planned across all three days.",
  },
  {
    question: "How can organizations become sponsors?",
    answer:
      "Organizations can contact the NTCE team through the registration form and mention sponsorship interest in the message field.",
  },
  {
    question: "Where is the conference venue?",
    answer:
      "The conference is hosted in Thimphu, Bhutan. Detailed venue guidance will be shared with registered participants.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Frequently Asked Questions"
        subtitle="Quick answers for attendees, speakers and partners"
      />

      <main className="inner-main">
        <section className="faq container">
          <div className="faq-list">
            {faqs.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
