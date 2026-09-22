import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/firebase/dataBridge";
import { getTravelAgencySchema } from "@/lib/seo";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap" 
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap" 
});

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nedhanyatours.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.businessName} | Northeast India Tour Packages & Car Rental`,
      template: `%s | ${settings.businessName}`,
    },
    description: settings.defaultMetaDescription,
    keywords: [
      "Northeast India tour packages",
      "Meghalaya tour package",
      "Arunachal Pradesh tour package",
      "Tawang taxi service",
      "Shillong car rental",
      "Assam travel agency",
      "Sikkim tour packages",
      "Bhutan tours from Guwahati",
      "NE Dhanya Tour and Travels",
      "Northeast car rental",
      "Personal vs sharing tour Northeast"
    ],
    authors: [{ name: settings.businessName }],
    creator: settings.businessName,
    publisher: settings.businessName,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: `${settings.businessName} | Northeast India & Bhutan Tour Specialist`,
      description: settings.defaultMetaDescription,
      siteName: settings.websiteName,
      images: [
        {
          url: settings.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${settings.businessName} Scenic Northeast Mountains`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.businessName} | Northeast Tours`,
      description: settings.defaultMetaDescription,
      images: [settings.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/images/logo-new.png",
      shortcut: "/images/logo-new.png",
      apple: "/images/logo-new.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const travelAgencySchema = getTravelAgencySchema(settings);

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script
          id="travel-agency-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencySchema) }}
        />
      </head>
      <body 
        className="antialiased bg-nature-bg text-slate-800 selection:bg-emerald-600 selection:text-white min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
