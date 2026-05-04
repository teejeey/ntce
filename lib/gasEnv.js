/** Resolves Apps Script deployment URL from env (supports static export via NEXT_PUBLIC_*). */
export function getGasWebAppUrl() {
  if (typeof process === "undefined") return "";
  let url = String(
    process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || process.env.GAS_WEB_APP_URL || ""
  ).trim();
  if (url.startsWith("http://")) {
    url = `https://${url.slice(7)}`;
  }
  return url;
}
