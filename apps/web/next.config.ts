import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bonus-tracker/ui", "@bonus-tracker/db"],
};

export default nextConfig;
