import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Complyt AI — Compliance Observability for Enterprises",
  description:
    "Complyt AI provides compliance observability, automated controls, and audit-ready reporting for enterprise SaaS platforms.",

  keywords: [
    "compliance",
    "audit",
    "security",
    "saas",
    "enterprise",
  ],

  authors: [
    {
      name: "Complyt AI",
    },
  ],

  openGraph: {
    title: "Complyt AI",
    description:
      "Compliance observability, automated controls, and audit-ready reporting for enterprise SaaS.",

    url: "https://complyt.ai",
    siteName: "Complyt AI",
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#0f172a",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        "dark font-sans"
      )}
    >
      <body className="min-h-screen bg-black text-white">{children}</body>
    </html>
  );
}