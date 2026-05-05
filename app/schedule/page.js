"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { getClientCache, setClientCache } from "../../lib/clientDataCache";
import { LIVE_DATA_REFRESH_MS } from "../../lib/constants/liveData";
import { CONFERENCE_DAY1, CONFERENCE_DAY2 } from "../../lib/programmeConferenceData";
import { speakerAnchorId, speakerDisplayName } from "../../lib/speakerAnchors";
import { fetchScheduleFromGas } from "../../lib/gasWebApp";
import { normalizeTimeSlotLabel } from "../../lib/schedule";

function ScheduleBodySkeleton() {
  return (
    <div className="schedule-body-skeleton" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="schedule-body-skeleton-card" />
      ))}
    </div>
  );
}

const emptyScheduleByDay = [
  {
    id: "day1",
    label: "Day 1",
    date: "15 May 2026",
    sessions: [],
  },
  {
    id: "day2",
    label: "Day 2",
    date: "16 May 2026",
    sessions: [],
  },
  {
    id: "day3",
    label: "Day 3",
    date: "17 May 2026",
    sessions: [],
  },
];

const SCHEDULE_CACHE_KEY = "schedule-page:v1";

const PROGRAMME_EXHIBITIONS = [
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

function getProgrammeButtonLabel(session) {
  const text = String(
    `${session?.description || session?.title || ""} ${session?.speaker || ""}`
  )
    .toLowerCase()
    .replace(/\s+/g, " ");
  const isGallery1Exhibition =
    /gallery\s*(i|1)\b/.test(text) && text.includes("exhibition");
  const isGallery2Conference =
    /gallery\s*(ii|2)\b/.test(text) && text.includes("conference");
  if (isGallery1Exhibition) return "View Exhibition Details";
  if (isGallery2Conference) return "View Conference Schedule";
  return "";
}

export default function SchedulePage() {
  const cached = getClientCache(SCHEDULE_CACHE_KEY);
  const [scheduleByDay, setScheduleByDay] = useState(cached || emptyScheduleByDay);
  /** First fetch still in progress — avoids showing a false “no items” before GAS returns. */
  const [dataReady, setDataReady] = useState(Boolean(cached));
  const [loadError, setLoadError] = useState("");
  const [activeDay, setActiveDay] = useState(emptyScheduleByDay[0].id);
  const [reloadTick, setReloadTick] = useState(0);
  const [isProgrammeModalOpen, setIsProgrammeModalOpen] = useState(false);
  const [programmeModalMode, setProgrammeModalMode] = useState("conference-day1");

  useEffect(() => {
    let isMounted = true;
    let inFlight = false;

    async function loadSchedule() {
      if (inFlight) return;
      inFlight = true;
      try {
        const result = await fetchScheduleFromGas();

        if (!result.ok) {
          throw new Error(result.error || "Failed to load schedule.");
        }

        const { day1, day2, day3 } = result.data;

        const mapped = [
          {
            id: "day1",
            label: "Day 1",
            date: "15 May 2026",
            sessions: day1 || [],
          },
          {
            id: "day2",
            label: "Day 2",
            date: "16 May 2026",
            sessions: day2 || [],
          },
          {
            id: "day3",
            label: "Day 3",
            date: "17 May 2026",
            sessions: day3 || [],
          },
        ];

        if (isMounted) {
          setClientCache(SCHEDULE_CACHE_KEY, mapped);
          setScheduleByDay(mapped);
          setLoadError("");
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message || "Could not load live schedule.");
        }
      } finally {
        inFlight = false;
        if (isMounted) {
          setDataReady(true);
        }
      }
    }

    loadSchedule();
    const handleFocus = () => {
      loadSchedule();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadSchedule();
      }
    };
    const intervalId = setInterval(() => {
      loadSchedule();
    }, LIVE_DATA_REFRESH_MS);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reloadTick]);

  const selectedDay = scheduleByDay.find((day) => day.id === activeDay) || null;

  const openProgrammeModal = (mode) => {
    setProgrammeModalMode(mode);
    setIsProgrammeModalOpen(true);
  };

  const closeProgrammeModal = () => setIsProgrammeModalOpen(false);

  return (
    <>
      <PageHero
        eyebrow="Conference Program"
        title="Conference & Exhibition Schedule"
        subtitle="Three days of talks, demos and exhibitions"
      />

      <main className="inner-main">
        <section className="schedule-wrap">
          <div className="container schedule-tabs-wrap">
            <div className="schedule-tabs">
              {scheduleByDay.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  className={`schedule-tab ${activeDay === day.id ? "active" : ""}`}
                  onClick={() => setActiveDay(day.id)}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <div className="schedule-cards expanded">
              {!dataReady && !loadError ? <ScheduleBodySkeleton /> : null}
              {dataReady && loadError ? (
                <div className="schedule-error-actions">
                  <p className="form-status error">{loadError}</p>
                  <button
                    type="button"
                    className="retry-btn"
                    onClick={() => {
                      setDataReady(false);
                      setLoadError("");
                      setReloadTick((v) => v + 1);
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : null}
              {dataReady && !loadError && selectedDay && selectedDay.sessions.length === 0 ? (
                <p>No schedule items available for this day yet.</p>
              ) : null}
              {dataReady && !loadError
                ? selectedDay?.sessions.map((session) => {
                    const speaker = String(session.speaker || "").trim();
                    const hasSpeaker = speaker && speaker !== "-" && speaker !== "—";
                    const programmeButtonLabel = getProgrammeButtonLabel(session);

                    return (
                      <article
                        className="schedule-card"
                        key={`${selectedDay?.id}-${session.id || session.title || session.description}`}
                      >
                        <div className="day">
                          <strong>{session.id || "-"}</strong>
                          <span>
                            {normalizeTimeSlotLabel(session.time_slot || session.time || "-") || "-"}
                          </span>
                        </div>
                        <div className="details">
                          <h3>{session.description || session.title}</h3>
                          {hasSpeaker ? <p className="schedule-speaker">{speaker}</p> : null}
                          {programmeButtonLabel ? (
                            <button
                              type="button"
                              className="btn btn-outline-dark schedule-inline-btn"
                              onClick={() =>
                                openProgrammeModal(
                                  programmeButtonLabel === "View Exhibition Details"
                                    ? "exhibitions"
                                    : selectedDay?.id === "day2"
                                      ? "conference-day2"
                                      : "conference-day1"
                                )
                              }
                            >
                              {programmeButtonLabel}
                            </button>
                          ) : null}
                        </div>
                      </article>
                    );
                  })
                : null}
            </div>
          </div>
        </section>
        {isProgrammeModalOpen ? (
          <div className="programme-modal-overlay" onClick={closeProgrammeModal}>
            <div
              className="programme-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Programme details"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="programme-modal-head">
                <h3>
                  {programmeModalMode === "exhibitions"
                    ? "Exhibitions (15 and 16 May 2026)"
                    : programmeModalMode === "conference-day2"
                      ? "Conference Schedule Day 2 (16th May 2026)"
                      : "Conference Schedule Day 1 (15th May 2026)"}
                </h3>
                <button
                  type="button"
                  className="programme-modal-close"
                  aria-label="Close programme details"
                  onClick={closeProgrammeModal}
                >
                  ×
                </button>
              </div>
              <div className="programme-modal-body">
                <table className="programme-table">
                  <thead>
                    {programmeModalMode === "exhibitions" ? (
                      <tr>
                        <th>Sl. No.</th>
                        <th>Organization</th>
                        <th>Exhibition Topic / Showcase</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>Sl. No.</th>
                        <th>Time Slot</th>
                        <th>Description</th>
                        <th>Speaker</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {programmeModalMode === "exhibitions"
                      ? PROGRAMME_EXHIBITIONS.map((row) => (
                          <tr key={`modal-exhibition-${row.slNo}`}>
                            <td>{row.slNo}</td>
                            <td>{row.organization}</td>
                            <td>
                              <ol className="programme-list">
                                {row.showcasePoints.map((point, index) => (
                                  <li key={`modal-showcase-${row.slNo}-${index}`}>{point}</li>
                                ))}
                              </ol>
                            </td>
                          </tr>
                        ))
                      : (programmeModalMode === "conference-day2" ? CONFERENCE_DAY2 : CONFERENCE_DAY1).map(
                          (row) => (
                            <tr key={`modal-${programmeModalMode}-${row.id}`}>
                              <td>{row.id}</td>
                              <td>{row.time_slot}</td>
                              <td>{row.description}</td>
                              <td>
                                {row.speaker ? (
                                  <a
                                    href={`/speakers#${speakerAnchorId(row.speaker)}`}
                                    className="schedule-speaker-link"
                                  >
                                    {speakerDisplayName(row.speaker) || row.speaker}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          )
                        )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
