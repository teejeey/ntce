"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { LIVE_DATA_REFRESH_MS } from "../../lib/constants/liveData";
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

export default function SchedulePage() {
  const [scheduleByDay, setScheduleByDay] = useState(emptyScheduleByDay);
  /** First fetch still in progress — avoids showing a false “no items” before GAS returns. */
  const [dataReady, setDataReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [activeDay, setActiveDay] = useState(emptyScheduleByDay[0].id);

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
    const intervalId = setInterval(() => {
      loadSchedule();
    }, LIVE_DATA_REFRESH_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const selectedDay = scheduleByDay.find((day) => day.id === activeDay) || null;

  return (
    <>
      <PageHero
        eyebrow="Conference Program"
        title="Event Schedule"
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
                <p className="form-status error">{loadError}</p>
              ) : null}
              {dataReady && !loadError && selectedDay && selectedDay.sessions.length === 0 ? (
                <p>No schedule items available for this day yet.</p>
              ) : null}
              {dataReady && !loadError
                ? selectedDay?.sessions.map((session) => {
                    const speaker = String(session.speaker || "").trim();
                    const hasSpeaker = speaker && speaker !== "-" && speaker !== "—";

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
                        </div>
                      </article>
                    );
                  })
                : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
