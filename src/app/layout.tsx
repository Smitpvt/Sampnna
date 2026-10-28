import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RestaurantJsonLd } from "@/components/seo/RestaurantJsonLd";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { site } from "@/config/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

const description =
  "Sampann Resort & Restaurant in Chaul, Alibag — Indian, Tandoor, Oriental, Continental and Konkan cooking in a warm, brick-arched dining room. View the menu and request a table.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Sampann — Resort & Restaurant, Chaul · Alibag", template: "%s · Sampann, Alibag" },
  description,
  applicationName: site.legalName,
  openGraph: {
    type: "website",
    siteName: site.legalName,
    locale: "en_IN",
    title: "Sampann — Resort & Restaurant, Chaul · Alibag",
    description,
    images: [{ url: "/images/og/dining-room-arches.jpg", width: 1200, height: 630, alt: "The Sampann dining room" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#272622",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-charcoal focus:px-4 focus:py-3 focus:text-ivory"
        >
          Skip to content
        </a>
        <RestaurantJsonLd />
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
