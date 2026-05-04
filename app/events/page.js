"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { fetchEventsFromSheet } from "../../lib/events";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const rows = await fetchEventsFromSheet();
      if (!cancel) {
        setEvents(rows);
        setMounted(true);
      }
    })();
    return () => {
      cancel = true;
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
