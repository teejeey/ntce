import HeroVenue from "./HeroVenue";
import Navbar from "./Navbar";

/**
 * Shared hero (full-width header with overlay): Navbar + eyebrow / title / subtitle / venue strip.
 *
 * @param {"home"|"inner"} variant - `home` omits `.hero-inner` for the landing banner.
 * @param {string} [eyebrow]
 * @param {import("react").ReactNode} title - Main headline (often text or fragment with `<br />`).
 * @param {string} [subtitle] - Renders below the title as `.hero-date`.
 * @param {boolean} [showVenue=true] - Include HeroVenue (map strip).
 */
export default function PageHero({
  variant = "inner",
  eyebrow,
  title,
  subtitle,
  showVenue = true,
  children,
}) {
  const headerClassName = variant === "home" ? "hero" : "hero hero-inner";

  return (
    <header className={headerClassName}>
      <div className="hero-overlay" />
      <Navbar />
      <section className="hero-content container">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p className="hero-date">{subtitle}</p> : null}
        {showVenue ? <HeroVenue /> : null}
        {children}
      </section>
    </header>
  );
}
