import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

const conferenceByCompany = [

  {
    slNo: 1,
    organization: "Ericsson",
    topics: [
      "From Connectivity to Capability: Transforming Societies through Next-Gen Networks & Infrastructure Innovation Strategies",
      "Living in the Future: How Digital Technologies Will Transform Everyday Life, Work, and Society",
    ],
    speakers: ["Dr. Ir. Ng Thiaw Seng", "Mr. Ravi Shekhar Pandey"],
  },
  {
    slNo: 2,
    organization: "Ciena & Teleindia Networks",
    topics: ["Data center scaling evolution", "Distributed AI and inference deployment"],
    speakers: ["Mr.Asish Kumar", "Mr.Mahanthesha Kestur Adaviswamy"],
  },
  {
    slNo: 3,
    organization: "Tejas Networks",
    topics: [
      "IMT-2030 / 6G: Latest Updates from ITU and 3GPP Standards",
      "Operationalizing AI/ML for Next-Generation Wireless Networks",
    ],
    speakers: ["Mr.Jishnu Aravindakshan", "Dr.Shantigram Jagannath"],
  },
  
  {
    slNo: 4,
    organization: "Cisco",
    topics: [
      "Cybersecurity as a Governance and Policy Imperative: Beyond IT",
      "Accelerating AI Deployments in Network Ecosystems",
    ],
    speakers: ["Mr.Diplmalya", "____________________"],
  },
  
  {
    slNo: 5,
    organization: "Nokia",
    topics: [
      "Trustworthy Networks for Mission-Critical Applications in Public Safety and Disaster Management",
    ],
    speakers: ["____________________"],
  },
  
  {
    slNo: 6,
    organization: "NDI",
    topics: ["Deployment of Bhutan NDI, its privacy-preserving architecture and existing use cases"],
    speakers: ["Mr.Kinzang Dorji "],
  },
  {
    slNo: 7,
    organization: "GovTech",
    topics: ["Satellite and Emerging Digital Projects"],
    speakers: ["____________________"],
  },
  {
    slNo: 8,
    organization: "DHI",
    topics: ["DHI"],
    speakers: ["____________________"],
  },
];

const exhibitions = [
  {
    slNo: 1,
    organization: "Ericsson",
    showcasePoints: [
      "Real-Life Digital Twin",
      "Smart Devices Transforming Daily Lives",
      "Photorealistic Holograms (including Smart Glasses)",
    ],
  },
  {
    slNo: 2,
    organization: "Nokia",
    showcasePoints: [
      "Trustworthy Networks for Mission-Critical Applications in Public Safety and Disaster Management",
      "Adaptive Grid / Utility Communications Network for Bhutan",
      "Quantum-Safe Networks: Secure Foundation for Digital Bhutan Initiatives",
    ],
  },
  {
    slNo: 3,
    organization: "Cisco",
    showcasePoints: ["Accelerated AI Deployments"],
  },
  {
    slNo: 4,
    organization: "Druk Holding & Investments (DHI)",
    showcasePoints: ["LoRaWAN and Computer Vision (CV) Solutions"],
  },
  {
    slNo: 5,
    organization: "National Digital Identity (NDI)",
    showcasePoints: [
      "Digital ID creation with features such as login, eKYC, and verifiable credentials, along with new services including digital signatures, mobile verification, offline CID card verification, and OTP-based messaging.",
    ],
  },
  {
    slNo: 6,
    organization: "Bhutan Telecom (BT)",
    showcasePoints: ["To be Confirmed"],
  },
  {
    slNo: 7,
    organization: "Government Technology (GovTech)",
    showcasePoints: ["To be Confirmed"],
  },
];

export default function ProgrammePage() {
  return (
    <>
      <PageHero
        eyebrow="Programme"
        title="Conference & Exhibition Programme"
        subtitle="Speaker topics and exhibition product details"
      />

      <main className="inner-main">
        <section className="container sponsors-page programme-page">
          <p className="section-tag">Programme Details</p>
          <h2>Conference Topics Table</h2>
          <div className="programme-table-wrap">
            <table className="programme-table">
              <thead>
                <tr>
                  <th>Sl. No.</th>
                  <th>Organization</th>
                  <th>Session Title</th>
                  <th>Speaker</th>
                </tr>
              </thead>
              <tbody>
                {conferenceByCompany.map((row) => (
                  <tr key={`conference-${row.slNo}`}>
                    <td>{row.slNo}</td>
                    <td>{row.organization}</td>
                    <td>
                      <ol className="programme-list">
                        {row.topics.map((topic, index) => (
                          <li key={`topic-${row.slNo}-${index}`}>{topic}</li>
                        ))}
                      </ol>
                    </td>
                    <td>
                      <ol className="programme-list">
                        {row.speakers.map((speaker, index) => (
                          <li key={`speaker-${row.slNo}-${index}`}>
                            <span className="programme-speaker-space">{speaker}</span>
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ marginTop: "1.4rem" }}>Exhibitions</h2>
          <div className="programme-table-wrap">
            <table className="programme-table">
              <thead>
                <tr>
                  <th>Sl. No.</th>
                  <th>Organization</th>
                  <th>Exhibition Topic / Showcase</th>
                </tr>
              </thead>
              <tbody>
                {exhibitions.map((row) => (
                  <tr key={`exhibition-${row.slNo}`}>
                    <td>{row.slNo}</td>
                    <td>{row.organization}</td>
                    <td>
                      <ol className="programme-list">
                        {row.showcasePoints.map((point, index) => (
                          <li key={`showcase-${row.slNo}-${index}`}>{point}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ marginTop: "1.4rem" }}>Panel discussion session</h2>
          <div className="sponsor-panel">
            <p className="programme-meta">
              <strong>Theme:</strong>{" "}
              &ldquo;Telecom Lifelines: Building Resilient and Inclusive Networks in Bhutan&rdquo;
            </p>
            <p className="programme-meta">
              <strong>Date:</strong> 16th May, 2026
            </p>
            <p className="programme-meta" style={{ marginTop: "0.65rem" }}>
              <strong>Tentative Panel member:</strong>
            </p>
            <ol className="programme-list programme-panel-members">
              <li>BICMA</li>
              <li>BTL</li>
              <li>TICPL</li>
              <li>GovTech</li>
              <li>BPC</li>
            </ol>
            <p className="programme-meta" style={{ marginTop: "0.85rem" }}>
              <strong>Moderator:</strong> Ms. Kimberly D. Johns, World Bank
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
