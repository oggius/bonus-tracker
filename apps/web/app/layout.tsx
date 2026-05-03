import type { Metadata } from "next";
import "@bonus-tracker/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "BonusTracker",
  description: "Family rewards tracker for activities and exchanges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
