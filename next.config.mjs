/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_EXPORT === "1";

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
};

export default nextConfig;
