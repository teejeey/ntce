import { API_ROUTE_CLIENT_TIMEOUT_MS } from "./apiRouteFetchDefaults";
import { fetchEventsFromGas } from "./gasWebApp";

function normalizeEventRow(row) {
  const id = String(row.id ?? "").trim();
  const rawDate = String(row.date ?? "").trim();
  const date = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;
  const title = String(row.title ?? "").trim();
  const description = String(row.description ?? "").trim();
  const link = String(row.link ?? "").trim();

  if (!title) return null;
  return { id, date, title, description, link };
}

export async function fetchEventsFromSheet(options = {}) {
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : API_ROUTE_CLIENT_TIMEOUT_MS;
  const result = await fetchEventsFromGas({
    ...options,
    timeoutMs,
  });

  if (!result.ok || !Array.isArray(result.data)) return [];

  const events = result.data.map(normalizeEventRow).filter(Boolean);
  return events.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
}
