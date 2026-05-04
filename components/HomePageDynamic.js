"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LIVE_DATA_REFRESH_MS } from "../lib/constants/liveData";
import { fetchEventsFromSheet } from "../lib/events";
import { fetchScheduleFromGas } from "../lib/gasWebApp";
import { getDayTimeRange } from "../lib/schedule";
import { fetchSpeakersFromSheet, speakerPortraitSrc } from "../lib/speakers";

export default function HomePageDynamic() {
  const [newsEvents, setNewsEvents] = useState([]);
  const [scheduleCards, setScheduleCards] = useState([
    {
      day: "Day 01",
      date: "15th May, 2026",
      title:
        "Inauguration, Opening Ceremony & Launch of Exhibition and Conference",
      timeRange: "",
    },
    {
      day: "Day 02",
      date: "16th May, 2026",
      title:
        "Exhibition Continuation, Conference Sessions and Panel Discussions",
      timeRange: "",
    },
    {
      day: "Day 03",
      date: "17th May, 2026",
      title:
        "World Telecommunication and Information Society Day (WTISD) Celebration, Awards & Closing Ceremony",
      timeRange: "",
    },
  ]);
  const [speakersPreview, setSpeakersPreview] = useState([]);
  const inFlight = useRef(false);

  const loadAll = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      const [eventsData, scheduleResult, allSpeakers] = await Promise.all([
        fetchEventsFromSheet(),
        fetchScheduleFromGas(),
        fetchSpeakersFromSheet(),
      ]);

      const scheduleData = scheduleResult.ok
        ? scheduleResult.data
        : { day1: [], day2: [], day3: [] };

      setNewsEvents(eventsData.slice(0, 3));
      setScheduleCards([
        {
          day: "Day 01",
          date: "15th May, 2026",
          title:
            "Inauguration, Opening Ceremony & Launch of Exhibition and Conference",
          timeRange: getDayTimeRange(scheduleData.day1),
        },
        {
          day: "Day 02",
          date: "16th May, 2026",
          title:
            "Exhibition Continuation, Conference Sessions and Panel Discussions",
          timeRange: getDayTimeRange(scheduleData.day2),
        },
        {
          day: "Day 03",
          date: "17th May, 2026",
          title:
            "World Telecommunication and Information Society Day (WTISD) Celebration, Awards & Closing Ceremony",
          timeRange: getDayTimeRange(scheduleData.day3),
        },
      ]);
      setSpeakersPreview(allSpeakers.slice(0, 4));
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    loadAll();
    const id = setInterval(() => loadAll(), LIVE_DATA_REFRESH_MS);
    return () => clearInterval(id);
  }, [loadAll]);

  return (
    <>
      <section className="news-events">
        <div className="container">
          <div className="section-heading">
            <p className="section-tag">News & Events</p>
            <h2>Latest Updates from NTCE</h2>
          </div>
          <div className="news-grid">
            {newsEvents.length > 0 ? (
              newsEvents.map((item) => (
                <article className="news-card" key={`${item.id}-${item.title}`}>
                  <p className="news-date">{item.date}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.link ? (
                    <a
                      className="news-link"
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Details
                    </a>
                  ) : null}
                </article>
              ))
            ) : (
              <p>No latest updates available yet.</p>
            )}
          </div>
          <div className="section-cta">
            <Link className="btn btn-outline-dark" href="/events">
              View More Updates
            </Link>
          </div>
        </div>
      </section>

      <section className="schedule-wrap">
        <div className="container schedule-grid">
          <div className="schedule-title">
            <p className="section-tag">Schedule</p>
            <h2>Event Schedule</h2>
          </div>
          <div className="schedule-cards">
            {scheduleCards.map((item) => (
              <article className="schedule-card" key={item.day}>
                <div className="day">
                  <strong>{item.day}</strong>
                  <span>{item.date}</span>
                </div>
                <div className="details">
                  <h3>{item.title}</h3>
                  <p>{item.timeRange || ""}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="speakers container">
        <div className="section-heading">
          <p className="section-tag">Speakers & Exhibitors</p>
          <h2>Meet the Featured Participants</h2>
        </div>
        <div className="speaker-grid">
          {speakersPreview.map(({ id, name, role, company, bio, photo }) => (
            <article className="speaker-card" key={`${id || name}`}>
              <img src={speakerPortraitSrc(name, photo)} alt={`${name} profile`} />
              <div>
                <h3>{name}</h3>
                <p>{role}</p>
                <p className="speaker-company">{company}</p>
                <div className="speaker-bio-extend">
                  <p className="speaker-bio-title">Professional Biography</p>
                  <p className="speaker-bio-text">
                    {bio || "Professional biography will be updated soon."}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="section-cta">
          <Link className="btn btn-outline-dark" href="/speakers">
            View All Speakers
          </Link>
        </div>
      </section>
    </>
  );
}
