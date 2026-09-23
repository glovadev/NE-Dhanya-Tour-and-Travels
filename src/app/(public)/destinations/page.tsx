import React from "react";
import { Metadata } from "next";
import { getAllDestinations, getSiteSettings } from "@/lib/firebase/dataBridge";
import { DestinationCard } from "@/components/public/DestinationCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { createWhatsAppLink, getGeneralEnquiryMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Northeast India & Bhutan Destinations | Tour Packages & Travel Guides",
  description: "Explore all 8 regions: Assam, Meghalaya, Arunachal Pradesh, Nagaland, Sikkim, Mizoram, Tripura, and Bhutan with NE Dhanya Tour and Travels.",
  alternates: {
    canonical: "/destinations",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();
  const settings = await getSiteSettings();
  const whatsappUrl = createWhatsAppLink(settings.whatsappNumber, getGeneralEnquiryMessage());

  return (
    <div className="pt-24 pb-20 bg-nature-bg min-h-screen">
      
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Destinations", url: "/destinations" }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Paradise of the East
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 font-heading">
            Northeast India & Bhutan Destinations
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Choose your dream destination. Each state offers unique wonders—from the living root bridges of Meghalaya and high Himalayan passes of Tawang to Kaziranga rhinos and the cliffside monasteries of Bhutan.
          </p>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 rounded-3xl bg-forest-900 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Need Help Choosing Between Northeast Destinations?
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl mx-auto leading-relaxed">
            Our local Northeast tour experts will help you pick the best circuit based on your travel dates, family requirements, and budget.
          </p>
          <div className="mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Talk to Travel Expert on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
