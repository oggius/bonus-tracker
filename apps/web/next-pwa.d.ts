declare module "next-pwa" {
  import type { NextConfig } from "next";

  type NextPwaOptions = {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    [key: string]: unknown;
  };

  export default function nextPWA(
    options?: NextPwaOptions
  ): (config: NextConfig) => NextConfig;
}
