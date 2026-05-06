import { fetchScheduleFromGas } from "./gasWebApp";

function parseMinutes(token, fallbackMeridiem = "") {
  const normalized = String(token || "").trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = (match[3] || fallbackMeridiem || "").toUpperCase();
  if (meridiem !== "AM" && meridiem !== "PM") return null;

  if (meridiem === "AM" && hours === 12) hours = 0;
  if (meridiem === "PM" && hours !== 12) hours += 12;

  return hours * 60 + minutes;
}

function parseIsoDateToken(token) {
  const raw = String(token || "").trim();
  if (!raw || !/^\d{4}-\d{2}-\d{2}T/i.test(raw)) return null;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatIsoDateToken(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Thimphu",
  }).formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value || "00";
  const minute = parts.find((p) => p.type === "minute")?.value || "00";
  const period = parts.find((p) => p.type === "dayPeriod")?.value?.toUpperCase() || "";
  return `${hour}:${minute} ${period}`.trim();
}

function normalizeSingleTimeToken(token) {
  const trimmed = String(token || "").trim();
  if (!trimmed) return "";

  const iso = parseIsoDateToken(trimmed);
  if (iso) {
    return formatIsoDateToken(iso);
  }

  return trimmed;
}

function parseTokenMinutes(token, fallbackMeridiem = "") {
  const normalized = normalizeSingleTimeToken(token);
  return parseMinutes(normalized, fallbackMeridiem);
}

function formatMinutes(totalMinutes) {
  const safe = Math.max(0, Number(totalMinutes) || 0);
  let hours = Math.floor(safe / 60) % 24;
  const minutes = safe % 60;
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

export function normalizeTimeSlotLabel(timeSlotValue) {
  const raw = String(timeSlotValue || "").trim();
  if (!raw) return "";

  const parts = raw.split(/\s*[-–—]\s*/).map((v) => v.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return `${normalizeSingleTimeToken(parts[0])} - ${normalizeSingleTimeToken(parts[1])}`;
  }

  return normalizeSingleTimeToken(raw);
}

export function getDayTimeRange(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return "";

  let minStart = Infinity;
  let maxEnd = -Infinity;

  for (const row of sessions) {
    const timeSlot = normalizeTimeSlotLabel(row?.time_slot || row?.time || "");
    if (!timeSlot) continue;

    const parts = timeSlot.split(/\s*[-–—]\s*/).map((v) => v.trim()).filter(Boolean);

    let start = null;
    let end = null;

    if (parts.length >= 2) {
      const startToken = String(parts[0] || "");
      const endToken = String(parts[1] || "");
      const endMeridiem = endToken.toUpperCase().includes("PM")
        ? "PM"
        : endToken.toUpperCase().includes("AM")
          ? "AM"
          : "";
      const startMeridiem = startToken.toUpperCase().includes("PM")
        ? "PM"
        : startToken.toUpperCase().includes("AM")
          ? "AM"
          : "";

      start = parseTokenMinutes(startToken, endMeridiem);
      end = parseTokenMinutes(endToken, startMeridiem || endMeridiem);
    } else {
      // Single time values (e.g. "8:30 AM") count as point events.
      start = parseTokenMinutes(parts[0]);
      end = start;
    }

    if (start == null || end == null) continue;

    if (start < minStart) minStart = start;
    if (end > maxEnd) maxEnd = end;
  }

  if (!Number.isFinite(minStart) || !Number.isFinite(maxEnd)) return "";
  return `${formatMinutes(minStart)} - ${formatMinutes(maxEnd)}`;
}

export async function fetchScheduleFromSheet(options = {}) {
  const result = await fetchScheduleFromGas(options);
  if (!result.ok || !result.data) {
    return { day1: [], day2: [], day3: [], day4: [] };
  }
  const d = result.data;
  return {
    day1: Array.isArray(d.day1) ? d.day1 : [],
    day2: Array.isArray(d.day2) ? d.day2 : [],
    day3: Array.isArray(d.day3) ? d.day3 : [],
    day4: Array.isArray(d.day4) ? d.day4 : [],
  };
}
