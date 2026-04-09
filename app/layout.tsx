import type { Metadata } from "next";
import { Inter, Doto, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ShadeSeat – Smart Bus Seat Finder",
  description: "Calculate which side of the bus will have shade based on route and sun position.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${doto.variable} ${plexMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
