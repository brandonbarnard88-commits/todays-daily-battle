import type { Metadata, Viewport } from "next";
import { Crimson_Text, Inter } from "next/font/google";
import Script from "next/script";

import { AddToHomePrompt } from "@/components/add-to-home-prompt";
import { RegisterServiceWorker } from "@/components/register-service-worker";
import { tdbThemeBootstrapInline } from "@/lib/tdb-theme-bootstrap";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Today's Daily Battle — A quiet place",
  description:
    "KJV only. No ads. No pressure. Just a gentle anchor for real battles — anxiety, parenting, grief, fear, and raising little ones.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "A quiet place for real daily battles",
    description:
      "KJV Scripture. Private. Offline-first. Family and kids welcome.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e3" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${crimson.variable} min-h-full flex flex-col antialiased`}
      >
        <Script
          id="tdb-theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: tdbThemeBootstrapInline }}
        />
        {children}
        <AddToHomePrompt />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
