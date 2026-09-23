import React from "react";
import { Metadata } from "next";
import { getSiteSettings } from "@/lib/firebase/dataBridge";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { HotelBookingClient } from "@/components/public/HotelBookingClient";

export const metadata: Metadata = {
  title: "Hotel Booking in Northeast India & Bhutan | Verified Stays & Resorts | NE Dhanya",
  description: "Complete hotel booking assistance across Shillong, Cherrapunji, Dawki, Kaziranga, Tawang, Gangtok & Bhutan. Verified clean stays, resorts, and authentic homestays.",
  alternates: {
    canonical: "/hotel-booking",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HotelBookingPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pt-24 pb-20 bg-nature-bg min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Hotel Booking", url: "/hotel-booking" }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <HotelBookingClient whatsappNumber={settings.whatsappNumber} />
      </div>

    </div>
  );
}

