import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "$10M+ Defense Startup Rounds (2025–26) | Defense Tech Funding Dashboard",
  description:
    "Interactive dashboard tracking 43 defense technology startups that raised $10M+ in 2025–2026. Covers autonomy, drones, hypersonics, space defense, and more across the US and Europe.",
  openGraph: {
    title: "$10M+ Defense Startup Rounds (2025–26)",
    description:
      "43 defense tech startups, $7.2B+ in total funding. Interactive charts, investor analysis, and company profiles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
