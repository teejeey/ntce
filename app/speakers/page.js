"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { getClientCache, setClientCache } from "../../lib/clientDataCache";
import { speakerAnchorId } from "../../lib/speakerAnchors";
import { LIVE_DATA_REFRESH_MS } from "../../lib/constants/liveData";
import { fetchSpeakersFromSheet, speakerPortraitSrc } from "../../lib/speakers";

const SPEAKERS_CACHE_KEY = "speakers-page:v1";

export default function SpeakersPage() {
  const cached = getClientCache(SPEAKERS_CACHE_KEY);
  const [speakers, setSpeakers] = useState(cached || []);
  const [mounted, setMounted] = useState(Boolean(cached));

  useEffect(() => {
    let cancel = false;
    const loadSpeakers = async () => {
      const rows = await fetchSpeakersFromSheet();
      if (!cancel) {
        setClientCache(SPEAKERS_CACHE_KEY, rows);
        setSpeakers(rows);
        setMounted(true);
      }
    };

    loadSpeakers();
    const handleFocus = () => loadSpeakers();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadSpeakers();
    };
    const intervalId = setInterval(() => loadSpeakers(), LIVE_DATA_REFRESH_MS);
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
        eyebrow="Leadership"
        title="Featured Speakers & Exhibitors"
        subtitle="Voices shaping Bhutan's digital future"
      />

      <main className="inner-main">
        <section className="speakers container">
          {!mounted ? (
            <p>Loading speakers…</p>
          ) : (
            <div className="speaker-grid speaker-grid-expandable">
              {speakers.map(({ id, name, role, company, bio, photo }) => (
                <article
                  className="speaker-card"
                  key={`${id || name}`}
                  id={speakerAnchorId(name) || undefined}
                >
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
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
