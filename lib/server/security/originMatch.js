function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\/+$/, "");
}

function parseOrigin(value) {
  try {
    const u = new URL(normalize(value));
    return { protocol: u.protocol, host: u.hostname, port: u.port };
  } catch {
    return null;
  }
}

function hostMatches(patternHost, actualHost) {
  if (patternHost === actualHost) return true;
  if (!patternHost.startsWith("*.")) return false;
  const suffix = patternHost.slice(1); // ".example.com"
  return actualHost.endsWith(suffix) && actualHost !== suffix.slice(1);
}

function patternMatches(pattern, actual) {
  const p = normalize(pattern);
  const a = normalize(actual);
  if (!p || !a) return false;
  if (p === a) return true;

  const pUrl = parseOrigin(p);
  const aUrl = parseOrigin(a);
  if (!pUrl || !aUrl) return false;
  if (pUrl.protocol !== aUrl.protocol) return false;
  if (!hostMatches(pUrl.host, aUrl.host)) return false;
  // Empty port means default for protocol.
  if (!pUrl.port) return true;
  return pUrl.port === aUrl.port;
}

export function splitOriginPatterns(raw) {
  return String(raw || "")
    .split(",")
    .map((s) => normalize(s))
    .filter(Boolean);
}

export function isOriginAllowed(actualOrigin, patterns) {
  return patterns.some((pattern) => patternMatches(pattern, actualOrigin));
}
