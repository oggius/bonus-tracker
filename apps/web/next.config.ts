import type { NextConfig } from "next";
import nextPWA from "next-pwa";
import path from "node:path";

const withPWA = nextPWA({
  dest: "public",
  // App Router has no _document.js, so next-pwa's auto-register is a no-op here.
  // Registration is handled by <ServiceWorkerRegister /> in the root layout.
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  importScripts: ["/push-sw.js"],
  buildExcludes: [/app-build-manifest\.json$/, /middleware-manifest\.json$/],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bonus-tracker/ui", "@bonus-tracker/db"],
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/.prisma/client/**/*",
      "../../node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/**/*",
      "../../node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client/**/*",
      "../../node_modules/.pnpm/@prisma+engines*/node_modules/@prisma/engines/**/*",
    ],
  },
};

export default withPWA(nextConfig);
