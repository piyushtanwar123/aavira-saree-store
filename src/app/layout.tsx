import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "@/components/store";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { whatsappNumber } from "@/lib/server-utils";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AAVIRA ESSENTIAL — Timeless Sarees, Everyday Elegance", template: "%s | AAVIRA ESSENTIAL" },
  description: "Discover beautiful Banarasi, Kanjivaram, silk, bridal, designer, and festive sarees. Heritage-inspired weaves, thoughtfully curated for every chapter of you.",
  applicationName: "AAVIRA ESSENTIAL",
  openGraph: { title: "AAVIRA ESSENTIAL", description: "Timeless Sarees, Everyday Elegance.", type: "website", locale: "en_IN", images: [{ url: "/images/hero-saree.jpg", width: 1568, height: 882, alt: "AAVIRA ESSENTIAL heritage saree collection" }] },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#681c30" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><a href="#main-content" className="skip-link">Skip to content</a><StoreProvider whatsappEnabled={!!whatsappNumber()}><SiteHeader /><div id="main-content">{children}</div><SiteFooter /></StoreProvider></body></html>;
}
