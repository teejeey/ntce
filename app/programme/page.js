"use client";

import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

// Conference Schedule Day 1 (same columns as schedule sheet: id, time_slot, description, speaker)
const CONFERENCE_DAY1 = [
  {
    id: 1,
    time_slot: "11:20 - 11:25 AM",
    description: "Session Chair",
    speaker:
      "Choining Tshomo (Assistant ICT,Gov Tech Agency)",
  },
  {
    id: 2,
    time_slot: "11:25 - 12:10 PM",
    description:
      "From connectivity to capability: How Next-Gen networks will transform society and economies Infrastructure innovation strategies",
    speaker: "Mr.Ng Thiaw Seng, Ercisson",
  },
  {
    id: 3,
    time_slot: "12:10 - 12:15 PM",
    description: "Session Chair",
    speaker: "Dawa (Assistant ICT, Gov Tech Agency)",
  },
  {
    id: 4,
    time_slot: "12:15 - 01:00 PM",
    description: "Data center scaling evolution",
    speaker: "Mr.Asish Kumar - Cienna",
  },
  {
    id: 5,
    time_slot: "01:00 - 02:00 PM",
    description: "Lunch Break",
    speaker: "",
  },
  {
    id: 6,
    time_slot: "02:00 - 02:05 PM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 7,
    time_slot: "02:05- 02:50 PM",
    description:
      "Cyber Security as a Governance and Policy Issue; Cyber Security – Much More Than a Matter of IT",
    speaker: "Mr.Diplmalya - Wizeretch Informatis Pvt",
  },
  {
    id: 8,
    time_slot: "02:50- 02:55 PM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 9,
    time_slot: "02:55- 03:40 PM",
    description: "NDI decentralized architecture",
    speaker: "Mr. Kinzang Dorji - NDI",
  },
  {
    id: 10,
    time_slot: "03:40- 04:00 PM",
    description: "Tea Break",
    speaker: "",
  },
  {
    id: 11,
    time_slot: "04:00- 04:05 PM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 12,
    time_slot: "04:05 - 04:50 PM",
    description: "IMT-2030/6G: Update from ITU and 3GPP standards",
    speaker: "Dr.Shantigram Jagannath - Tejas Networks",
  },
  {
    id: 13,
    time_slot: "04:50 - 04:55 PM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 14,
    time_slot: "04:55 - 05:40 PM",
    description:
      "Cisco Secure AI Factory - Enabling Enterprise from Data Center to Edge",
    speaker: "Mr. Anuj Singhi - Cisco",
  },
];

// Conference Schedule Day 2
const CONFERENCE_DAY2 = [
  {
    id: 1,
    time_slot: "09:00 - 09:05 AM",
    description: "Opening session Chair",
    speaker: "Moderator",
  },
  {
    id: 2,
    time_slot: "09:05- 09:50 AM",
    description: "Distributed AI and inference deployment",
    speaker: "Mr.Mahanthesha Kestur Adaviswamy",
  },
  {
    id: 3,
    time_slot: "09:50 - 09:55 AM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 4,
    time_slot: "09:55 - 10:00 AM",
    description:
      "Trustworthy Networks for Mission Critical Application for Public Safety, Disaster Management",
    speaker: "Nokia",
  },
  {
    id: 5,
    time_slot: "10:00 - 10:30 AM",
    description: "Tea Break",
    speaker: "",
  },
  {
    id: 6,
    time_slot: "10:30- 10:35 AM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 7,
    time_slot: "10:35 - 11:20 AM",
    description: "Operationalizing AI/ML for wireless networks",
    speaker: "Mr.Jishnu Aravindakshan",
  },
  {
    id: 8,
    time_slot: "11:20 - 11:25 AM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 9,
    time_slot: "11:25 - 12:10 PM",
    description: "InnoTech: Overview of Projects, Research, and Innovation Ecosystem",
    speaker: "Ms.Tshering Yangzom",
  },
  {
    id: 10,
    time_slot: "12:10 - 12:15 PM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 11,
    time_slot: "12:15 - 01:00 PM",
    description: "Satellite and Emerging Digital Projects",
    speaker: "To be confirmed",
  },
  {
    id: 12,
    time_slot: "01:00 - 02:00 PM",
    description: "Lunch Break",
    speaker: "",
  },
  {
    id: 13,
    time_slot: "02:00 - 02:05 PM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 14,
    time_slot: "02:05 - 04:00 PM",
    description:
      "Panel Discussion: Telecom Lifelines: Building Resilient and Inclusive Networks in Bhutan",
    speaker: "Moderator:Ms. Kimberly D. Johns, World Bank",
  },
  {
    id: 15,
    time_slot: "04:00 - 04:30 PM",
    description: "Coffee Break",
    speaker: "",
  },
  {
    id: 16,
    time_slot: "04:30 - 04:35 PM",
    description: "Session Chair",
    speaker: "Moderator",
  },
  {
    id: 17,
    time_slot: "04:35 - 05:20 PM",
    description:
      "Living in the Future: How Digital Technologies Will Transform Everyday Life, Work, and Society",
    speaker: "Mr. Ravi Shekhar Pandey",
  },
];

// Static exhibitions table (unchanged from previous version)
const EXHIBITIONS = [
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
        subtitle="Conference schedule for Day 1 and Day 2, plus exhibition showcases"
      />

      <main className="inner-main">
        <section className="container sponsors-page programme-page">
          <p className="section-tag">Programme Details</p>

          <h2 id="conference-day-1">Conference Schedule Day 1</h2>
          <div className="programme-table-wrap">
            <table className="programme-table">
              <thead>
                <tr>
                  <th>Sl. No.</th>
                  <th>Time Slot</th>
                  <th>Description</th>
                  <th>Speaker</th>
                </tr>
              </thead>
              <tbody>
                {CONFERENCE_DAY1.map((row) => (
                  <tr key={`day1-${row.id}`}>
                    <td>{row.id}</td>
                    <td>{row.time_slot}</td>
                    <td>{row.description}</td>
                    <td>{row.speaker || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="conference-day-2" style={{ marginTop: "1.4rem" }}>
            Conference Schedule Day 2
          </h2>
          <div className="programme-table-wrap">
            <table className="programme-table">
              <thead>
                <tr>
                  <th>Sl. No.</th>
                  <th>Time Slot</th>
                  <th>Description</th>
                  <th>Speaker</th>
                </tr>
              </thead>
              <tbody>
                {CONFERENCE_DAY2.map((row) => (
                  <tr key={`day2-${row.id}`}>
                    <td>{row.id}</td>
                    <td>{row.time_slot}</td>
                    <td>{row.description}</td>
                    <td>{row.speaker || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="exhibitions" style={{ marginTop: "1.4rem" }}>
            Exhibitions
          </h2>
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
                {EXHIBITIONS.map((row) => (
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

