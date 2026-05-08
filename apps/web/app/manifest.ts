import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BonusTracker",
    short_name: "BonusTracker",
    description: "Family rewards tracker for activities and exchanges.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f4f6",
    theme_color: "#f59e0b",
    lang: "uk",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
