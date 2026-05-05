"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { getClientCache, setClientCache } from "../../lib/clientDataCache";
import { LIVE_DATA_REFRESH_MS } from "../../lib/constants/liveData";
import { fetchEventsFromSheet } from "../../lib/events";

const EVENTS_CACHE_KEY = "events-page:v1";

export default function EventsPage() {
  const cached = getClientCache(EVENTS_CACHE_KEY);
  const [events, setEvents] = useState(cached || []);
  const [mounted, setMounted] = useState(Boolean(cached));

  useEffect(() => {
    let cancel = false;
    const loadEvents = async () => {
      const rows = await fetchEventsFromSheet();
      if (!cancel) {
        setClientCache(EVENTS_CACHE_KEY, rows);
        setEvents(rows);
        setMounted(true);
      }
    };

    loadEvents();
    const handleFocus = () => loadEvents();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadEvents();
    };
    const intervalId = setInterval(() => loadEvents(), LIVE_DATA_REFRESH_MS);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancel = true;
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="News & Events"
        title="Latest Updates"
        subtitle="Announcements, deadlines and conference highlights"
      />

      <main className="inner-main">
        <section className="news-events">
          <div className="container">
            <div className="news-grid">
              {!mounted ? (
                <p>Loading updates…</p>
              ) : events.length > 0 ? (
                events.map((item) => (
                  <article className="news-card" key={`${item.id}-${item.title}`}>
                    <p className="news-date">{item.date}</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    
                  </article>
                ))
              ) : (
                <p>No events available yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
