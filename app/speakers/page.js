"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { fetchSpeakersFromSheet, speakerPortraitSrc } from "../../lib/speakers";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const rows = await fetchSpeakersFromSheet();
      if (!cancel) {
        setSpeakers(rows);
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
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
