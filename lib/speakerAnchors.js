function cleanSpeakerName(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";

  // Keep common title prefixes but drop role/org suffixes.
  const withoutLabel = value.replace(/^moderator\s*:\s*/i, "").trim();
  const beforeComma = withoutLabel.split(",")[0].trim();
  const beforeDash = beforeComma.split(/\s-\s/)[0].trim();
  return beforeDash;
}

export function speakerAnchorId(name) {
  const clean = cleanSpeakerName(name).toLowerCase();
  if (!clean) return "";
  const slug = clean
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return slug ? `speaker-${slug}` : "";
}

export function speakerDisplayName(raw) {
  return cleanSpeakerName(raw);
}
