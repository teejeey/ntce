/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_EXPORT === "1";
const remoteApiBase = String(process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");

const nextConfig = {
  /**
   * Hostnames allowed to load dev-only assets (`/_next/webpack-hmr`, etc.) cross-origin.
   * Use bare hostnames (no `https://`). Wildcards match one label (see Next CSRF origin rules).
   */
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "100.87.97.55",
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
  ],
  devIndicators: false,

  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_GAS_WEB_APP_URL:
      process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || process.env.GAS_WEB_APP_URL || "",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  },
  async headers() {
    const connectSources = [
      "'self'",
      "https://script.google.com",
      "https://script.googleusercontent.com",
    ];
    if (remoteApiBase) {
      connectSources.push(remoteApiBase);
    }
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      `connect-src ${connectSources.join(" ")}`,
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
