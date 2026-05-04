import { API_ROUTE_CLIENT_TIMEOUT_MS } from "./apiRouteFetchDefaults";
import { fetchSpeakersFromGas } from "./gasWebApp";

function normalizeSpeakerRow(row) {
  const id = String(row?.id ?? "").trim();
  const name = String(row?.name ?? "").trim();
  const role = String(row?.designation ?? "").trim();
  const company = String(row?.company ?? "").trim();
  const bio = String(row?.biography ?? "").trim();
  const photo = String(row?.photo ?? "").trim();

  if (!name) return null;
  return { id, name, role, company, bio, photo };
}

function extractGoogleDriveFileId(url) {
  const value = String(url || "").trim();
  if (!value) return "";

  const fileMatch = value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileMatch?.[1]) return fileMatch[1];

  const ucMatch = value.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (ucMatch?.[1]) return ucMatch[1];

  return "";
}

export function speakerPortraitSrc(name, photo = "") {
  let photoValue = String(photo || "").trim();
  if (photoValue.startsWith("http://")) {
    photoValue = `https://${photoValue.slice(7)}`;
  }
  if (photoValue) {
    if (/^https?:\/\//i.test(photoValue)) {
      const isGoogleDrive = /drive\.google\.com|googleusercontent\.com/i.test(photoValue);
      if (isGoogleDrive) {
        const fileId = extractGoogleDriveFileId(photoValue);
        if (fileId) {
          return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
      }
      return photoValue;
    }
    if (photoValue.startsWith("/")) return photoValue;

    // Accept "public/speakers/x.png", "speakers/x.png", "x.png", or "x"
    const normalized = photoValue
      .replace(/^public[\\/]/i, "")
      .replace(/^speakers[\\/]/i, "");
    const fileName = /\.[a-z0-9]+$/i.test(normalized) ? normalized : `${normalized}.png`;
    return `/speakers/${encodeURIComponent(fileName)}`;
  }

  const fallback = String(name || "").trim();
  if (!fallback) return "";
  return `/speakers/${encodeURIComponent(fallback)}.png`;
}

export async function fetchSpeakersFromSheet(options = {}) {
  const timeoutMs =
    Number(options?.timeoutMs) > 0 ? Number(options.timeoutMs) : API_ROUTE_CLIENT_TIMEOUT_MS;
  const result = await fetchSpeakersFromGas({
    ...options,
    timeoutMs,
  });

  if (!result.ok || !Array.isArray(result.data)) return [];

  const speakers = result.data.map(normalizeSpeakerRow).filter(Boolean);
  return speakers.sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
}
