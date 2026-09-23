import React from "react";
import { Metadata } from "next";
import { getAllPackages, getSiteSettings } from "@/lib/firebase/dataBridge";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { PackageCard } from "@/components/public/PackageCard";
import { createWhatsAppLink, getGeneralEnquiryMessage } from "@/lib/whatsapp";
import { ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Northeast India Tour Packages | Meghalaya, Tawang, Kaziranga & Bhutan",
  description: "Browse curated Northeast India tour packages. Personal private tours & budget sharing tours across Assam, Meghalaya, Arunachal, Sikkim & Bhutan.",
  alternates: {
    canonical: "/tour-packages",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TourPackagesPage() {
  const packages = await getAllPackages();
  const settings = await getSiteSettings();
  const customWhatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    "Hello NE Dhanya Tour and Travels, I want to create a customized Northeast tour package. Please share itinerary ideas."
  );

  return (
    <div className="pt-24 pb-20 bg-nature-bg min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Tour Packages", url: "/tour-packages" }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Handcrafted Northeast Journeys
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 font-heading">
            Northeast India Tour Packages
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            All our tour packages can be customized around your dates and travel style. Choose private vehicles for family privacy or join friendly sharing tours to save costs.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              whatsappNumber={settings.whatsappNumber}
            />
          ))}
        </div>

        {/* Custom Tour Banner */}
        <div className="mt-16 rounded-3xl bg-forest-950 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
            100% Customized Itinerary
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading mt-3">
            Want a Custom Multi-State Northeast Tour?
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl mx-auto leading-relaxed">
            Combine Assam and Meghalaya, or venture on an extended Arunachal and Bhutan expedition. We build your itinerary exactly how you want it.
          </p>
          <div className="mt-6">
            <a
              href={customWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Get Custom Itinerary on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
