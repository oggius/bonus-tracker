import type { NextConfig } from "next";
import nextPWA from "next-pwa";
import path from "node:path";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
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
