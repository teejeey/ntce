/** @type {import('next').NextConfig} */
const isRenderBuild =
  String(process.env.RENDER || "").toLowerCase() === "true" ||
  Boolean(process.env.RENDER_SERVICE_ID);
const isStaticExport = process.env.NEXT_EXPORT === "1" && !isRenderBuild;
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
      "frame-ancestors 'self'",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      `connect-src ${connectSources.join(" ")}`,
      "form-action 'self'",
    ].join("; ");

    /** @type {{ key: string; value: string }[]} */
    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      {
        key: "Permissions-Policy",
        value:
          "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(self), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()",
      },
    ];

    if (process.env.NODE_ENV === "production") {
      securityHeaders.unshift({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }

    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
