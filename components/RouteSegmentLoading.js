/**
 * Shown by route-level loading.js files during client navigations while the next segment loads.
 * Keeps the shell lightweight so transitions feel instant.
 */
export default function RouteSegmentLoading() {
  return (
    <div className="route-segment-loading" aria-busy="true" aria-live="polite">
      <div className="route-segment-loading-inner container">
        <div className="route-segment-loading-bar" />
        <p className="route-segment-loading-text">Loading page…</p>
      </div>
    </div>
  );
}
