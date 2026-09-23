import React from "react";
import { getSiteSettings, getAllDestinations } from "@/lib/firebase/dataBridge";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";
import { MobileStickyBar } from "@/components/public/MobileStickyBar";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, destinations] = await Promise.all([
    getSiteSettings(),
    getAllDestinations()
  ]);

  return (
    <>
      <Header settings={settings} destinations={destinations} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />
      <MobileStickyBar whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
