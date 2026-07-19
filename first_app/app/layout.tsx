// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import VisitTracker from "./components/VisitTracker"; // ✅ Import VisitTracker

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Judicial e-Service Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/judiciary_favicon.png" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <VisitTracker /> {/* ✅ Add VisitTracker here */}
          {children}
        </Providers>
      </body>
    </html>
  );
}