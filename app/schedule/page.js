"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { getClientCache, setClientCache } from "../../lib/clientDataCache";
import { LIVE_DATA_REFRESH_MS } from "../../lib/constants/liveData";
import { fetchScheduleFromGas } from "../../lib/gasWebApp";
import { speakerDisplayName } from "../../lib/speakerAnchors";
import { fetchSpeakersFromSheet, speakerPortraitSrc } from "../../lib/speakers";
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

/**
 * Sheet-backed tabs: `day1`/`day2`/`day3` ids are stable for UI and cache.
 * Google Sheet → JSON (see GOOGLE_APPS_SCRIPT_SETUP.md):
 *   Day 1 → day1; Conference Day 1 → day2; Conference Day 2 → day4; Day 3 → day3 (WTISD).
 */
const SCHEDULE_DAY_DEFS = [
  {
    id: "day1",
    label: "Opening Ceremony",
    date: "15 May 2026",
    contentDate: "15th May 2026",
  },
  {
    id: "day2",
    label: "Conference Day 1",
    date: "15 May 2026",
    contentDate: "15th May 2026",
  },
  {
    id: "day3",
    label: "Conference Day 2",
    date: "16 May 2026",
    contentDate: "16th May 2026",
  },
];

function buildScheduleDaysFromSessions(openingSessions, conferenceDay1Sessions, conferenceDay2TabSessions) {
  const sessionsByIndex = [
    openingSessions || [],
    conferenceDay1Sessions || [],
    conferenceDay2TabSessions || [],
  ];
  return SCHEDULE_DAY_DEFS.map((def, i) => ({
    ...def,
    sessions: sessionsByIndex[i],
  }));
}

const emptyScheduleByDay = buildScheduleDaysFromSessions([], [], []);

/** Extra tabs; WTISD uses API `day3`; Exhibitions uses static list below. */
const SCHEDULE_EXTRA_TABS = [
  { id: "wtisd", label: "WTISD", contentDate: "17th May 2026" },
  { id: "exhibitions", label: "Exhibitions", contentDate: "15th–16th May 2026" },
];

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
    showcasePoints: [
      "Digital Fabrication: JNWSFL Innovation Lab",
      "IoT & LoRaWAN: Sensing Bhutan",
      "Artificial Intelligence: Intelligent Systems for Bhutan",
      "Data Analytics Platform: From Data to Decisions",
    ],
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
    organization: "Government Technology (GovTech)",
    showcasePoints: ["To be Confirmed"],
  },
   // {
  //   slNo: 6,
  //   organization: "Bhutan Telecom (BT)",
  //   showcasePoints: ["To be Confirmed"],
  // },
];

const EXHIBITIONS_TAB_ID = "exhibitions";

/**
 * Same layout as programme schedule cards: left column (like time slot) = company name;
 * details column = numbered showcase list. `useOuterGrid` wraps modal content in `.schedule-cards`.
 */
function ProgrammeExhibitionsCards({ keyPrefix }) {
  const cards = PROGRAMME_EXHIBITIONS.map((row) => {
    const points = Array.isArray(row.showcasePoints) ? row.showcasePoints : [];
    const single = points.length === 1;

    return (
      <article
        className="schedule-card schedule-exhibition-card"
        key={`${keyPrefix}-${row.slNo}`}
      >
        <div className="day">
          <span>{row.organization}</span>
        </div>
        <div className="details">
          {points.length === 0 ? (
            <p className="schedule-exhibition-single-demo">—</p>
          ) : single ? (
            <p className="schedule-exhibition-single-demo">{points[0]}</p>
          ) : (
            <ol
              className="schedule-exhibition-showcase-list"
              aria-label={`Showcase topics for ${row.organization}`}
            >
              {points.map((point, index) => (
                <li key={`${keyPrefix}-${row.slNo}-${index}`}>{point}</li>
              ))}
            </ol>
          )}
        </div>
      </article>
    );
  });

  return <>{cards}</>;
}

function buildScheduleTabsRow(scheduleByDay) {
  const extra = (id) => SCHEDULE_EXTRA_TABS.find((t) => t.id === id);
  return [
    scheduleByDay.find((d) => d.id === "day1"),
    extra("exhibitions"),
    scheduleByDay.find((d) => d.id === "day2"),
    scheduleByDay.find((d) => d.id === "day3"),
    extra("wtisd"),
  ].filter(Boolean);
}

const DATA_TAB_IDS = new Set(SCHEDULE_DAY_DEFS.map((d) => d.id));

const WTISD_TAB_ID = "wtisd";

/** Conference Day 1 / Day 2 tabs — show register link next to panel date. */
const CONFERENCE_REGISTER_TAB_IDS = new Set(["day2", "day3"]);
const CONFERENCE_PROGRAMME_TAB_IDS = new Set(["day2", "day3"]);

/** Tabs that render the live schedule grid (sheet rows + WTISD from API day3). */
function isScheduleGridTab(activeDay) {
  return DATA_TAB_IDS.has(activeDay) || activeDay === WTISD_TAB_ID;
}

function hydrateScheduleDaysFromCache(cached) {
  if (!cached || !Array.isArray(cached)) return emptyScheduleByDay;
  return SCHEDULE_DAY_DEFS.map((def) => {
    const hit = cached.find((d) => d.id === def.id);
    return { ...def, sessions: Array.isArray(hit?.sessions) ? hit.sessions : [] };
  });
}

/** Prefer defs lookup — state rows only guarantee sessions/id/label/date from merges/cache. */
function getActiveTabContentDate(activeDay) {
  const dayDef = SCHEDULE_DAY_DEFS.find((d) => d.id === activeDay);
  if (dayDef?.contentDate) return dayDef.contentDate;
  return SCHEDULE_EXTRA_TABS.find((t) => t.id === activeDay)?.contentDate || "";
}

const SCHEDULE_CACHE_VERSION = 2;

function hydrateScheduleBundle(cached) {
  if (
    cached &&
    typeof cached === "object" &&
    !Array.isArray(cached) &&
    cached.version === SCHEDULE_CACHE_VERSION &&
    Array.isArray(cached.scheduleByDay)
  ) {
    return {
      scheduleByDay: hydrateScheduleDaysFromCache(cached.scheduleByDay),
      wtisdSessions: Array.isArray(cached.wtisdSessions) ? cached.wtisdSessions : [],
    };
  }
  if (Array.isArray(cached)) {
    const base = hydrateScheduleDaysFromCache(cached);
    const legacyWtisd = base.find((d) => d.id === "day3")?.sessions ?? [];
    const scheduleByDay = base.map((d) =>
      d.id === "day3" ? { ...d, sessions: [] } : d,
    );
    return { scheduleByDay, wtisdSessions: legacyWtisd };
  }
  return { scheduleByDay: emptyScheduleByDay, wtisdSessions: [] };
}

/** Bump when schedule API shape/mapping changes — avoids stale client cache without day4 rows. */
const SCHEDULE_CACHE_KEY = "schedule-page:v4";

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

function allowSpeakerProfileButton(description) {
  const text = String(description || "").toLowerCase();
  return !/(session\s*chair|lunch|tea)/i.test(text);
}

function normalizeSpeakerKey(value) {
  return speakerDisplayName(value).trim().toLowerCase();
}

export default function SchedulePage() {
  const cached = getClientCache(SCHEDULE_CACHE_KEY);
  const initialBundle = hydrateScheduleBundle(cached);
  const [scheduleByDay, setScheduleByDay] = useState(() => initialBundle.scheduleByDay);
  const [wtisdSessions, setWtisdSessions] = useState(() => initialBundle.wtisdSessions);
  /** First fetch still in progress — avoids showing a false “no items” before GAS returns. */
  const [dataReady, setDataReady] = useState(Boolean(cached));
  const [loadError, setLoadError] = useState("");
  const [activeDay, setActiveDay] = useState(emptyScheduleByDay[0].id);
  const [reloadTick, setReloadTick] = useState(0);
  const [speakerDirectory, setSpeakerDirectory] = useState([]);
  const [activeSpeakerProfile, setActiveSpeakerProfile] = useState(null);
  const tabTopRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let inFlight = false;
    let retryTimerId = null;

    async function loadSchedule() {
      if (inFlight) return;
      inFlight = true;
      try {
        const [result, speakers] = await Promise.all([
          fetchScheduleFromGas(),
          fetchSpeakersFromSheet(),
        ]);

        if (!result.ok) {
          throw new Error(result.error || "Failed to load schedule.");
        }

        const { day1, day2, day3, day4 } = result.data;
        const mapped = buildScheduleDaysFromSessions(day1, day2, day4 || []);
        const wtisd = Array.isArray(day3) ? day3 : [];

        if (isMounted) {
          setClientCache(SCHEDULE_CACHE_KEY, {
            version: SCHEDULE_CACHE_VERSION,
            scheduleByDay: mapped,
            wtisdSessions: wtisd,
          });
          setScheduleByDay(mapped);
          setWtisdSessions(wtisd);
          setSpeakerDirectory(Array.isArray(speakers) ? speakers : []);
          setLoadError("");
          setDataReady(true);
        }
      } catch (error) {
        if (isMounted) {
          // Keep UI quiet on transient upstream failures and retry automatically.
          setLoadError("");
          if (!cached) setDataReady(false);
          retryTimerId = setTimeout(() => {
            loadSchedule();
          }, 2500);
        }
      } finally {
        inFlight = false;
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
      if (retryTimerId) clearTimeout(retryTimerId);
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reloadTick]);

  const selectedDay = scheduleByDay.find((day) => day.id === activeDay) || null;
  const scheduleTabs = buildScheduleTabsRow(scheduleByDay);
  const panelContentDate = getActiveTabContentDate(activeDay);
  const activeSessions =
    activeDay === WTISD_TAB_ID ? wtisdSessions : selectedDay?.sessions ?? [];
  const sessionRowKeyPrefix =
    activeDay === WTISD_TAB_ID ? WTISD_TAB_ID : selectedDay?.id ?? activeDay;

  const switchTab = (nextTabId) => {
    setActiveDay(nextTabId);
    requestAnimationFrame(() => {
      tabTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openSpeakerDetails = (rawSpeaker) => {
    const displayName = speakerDisplayName(rawSpeaker).trim();
    const key = normalizeSpeakerKey(displayName);
    const match = speakerDirectory.find((item) => normalizeSpeakerKey(item?.name) === key);
    setActiveSpeakerProfile(
      match || {
        name: displayName || String(rawSpeaker || "").trim(),
        role: "",
        company: "",
        bio: "Speaker profile will be updated soon.",
        photo: "",
      }
    );
  };

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
            <div className="schedule-tabs" ref={tabTopRef}>
              {scheduleTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`schedule-tab ${activeDay === tab.id ? "active" : ""}`}
                  onClick={() => switchTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="schedule-cards expanded">
              {panelContentDate ? (
                <div className="schedule-panel-date-row">
                  <p className="schedule-panel-date">{panelContentDate}</p>
                  {CONFERENCE_REGISTER_TAB_IDS.has(activeDay) ? (
                    <Link href="/register" className="schedule-panel-register-link">
                      Register for conference
                    </Link>
                  ) : null}
                </div>
              ) : null}
              {isScheduleGridTab(activeDay) ? (
                <>
                  {!dataReady && !loadError ? <ScheduleBodySkeleton /> : null}
                  {dataReady && !loadError && activeSessions.length === 0 ? (
                    <p>No schedule items available for this day yet.</p>
                  ) : null}
                  {dataReady && !loadError
                    ? activeSessions.map((session) => {
                        const speaker = String(session.speaker || "").trim();
                        const hasSpeaker = speaker && speaker !== "-" && speaker !== "—";
                        const programmeButtonLabel = getProgrammeButtonLabel(session);
                        const showSpeakerProfileButton =
                          CONFERENCE_PROGRAMME_TAB_IDS.has(activeDay) &&
                          hasSpeaker &&
                          allowSpeakerProfileButton(session.description || session.title);

                        return (
                          <article
                            className="schedule-card"
                            key={`${sessionRowKeyPrefix}-${session.id || session.title || session.description}`}
                          >
                            <div className="day">
                              <span>
                                {normalizeTimeSlotLabel(session.time_slot || session.time || "-") || "-"}
                              </span>
                            </div>
                            <div className="details">
                              <h3>{session.description || session.title}</h3>
                              {hasSpeaker ? <p className="schedule-speaker">{speaker}</p> : null}
                              {showSpeakerProfileButton ? (
                                <button
                                  type="button"
                                  className="btn btn-outline-dark schedule-inline-btn"
                                  onClick={() => openSpeakerDetails(speaker)}
                                >
                                  Speaker Profile
                                </button>
                              ) : null}
                              {programmeButtonLabel ? (
                                <button
                                  type="button"
                                  className="btn btn-outline-dark schedule-inline-btn"
                                  onClick={() =>
                                    switchTab(
                                      programmeButtonLabel === "View Exhibition Details"
                                        ? EXHIBITIONS_TAB_ID
                                        : "day2"
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
                </>
              ) : activeDay === EXHIBITIONS_TAB_ID ? (
                <ProgrammeExhibitionsCards keyPrefix="schedule-tab-exhibitions" />
              ) : null}
            </div>
          </div>
        </section>
        {activeSpeakerProfile ? (
          <div
            className="programme-modal-overlay"
            onClick={() => setActiveSpeakerProfile(null)}
          >
            <div
              className="programme-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Speaker details"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="programme-modal-head">
                <h3>Speaker Profile</h3>
                <button
                  type="button"
                  className="programme-modal-close"
                  aria-label="Close speaker details"
                  onClick={() => setActiveSpeakerProfile(null)}
                >
                  ×
                </button>
              </div>
              <div className="programme-modal-body">
                <article className="schedule-speaker-profile-card">
                  {activeSpeakerProfile.photo ? (
                    <img
                      src={speakerPortraitSrc(
                        activeSpeakerProfile.name,
                        activeSpeakerProfile.photo
                      )}
                      alt={`${activeSpeakerProfile.name} profile`}
                    />
                  ) : null}
                  <div>
                    <h4>{activeSpeakerProfile.name || "Speaker"}</h4>
                    {activeSpeakerProfile.role ? (
                      <p className="schedule-speaker-profile-meta">
                        {activeSpeakerProfile.role}
                      </p>
                    ) : null}
                    {activeSpeakerProfile.company ? (
                      <p className="schedule-speaker-profile-meta">
                        {activeSpeakerProfile.company}
                      </p>
                    ) : null}
                    <p className="schedule-speaker-profile-bio">
                      {activeSpeakerProfile.bio || "Speaker profile will be updated soon."}
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
