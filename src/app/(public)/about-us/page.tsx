import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Compass, 
  Users, 
  Car, 
  Building2, 
  MapPin, 
  CheckCircle2,
  Heart
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getSiteSettings } from "@/lib/firebase/dataBridge";
import { createWhatsAppLink, getGeneralEnquiryMessage } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";

export const metadata: Metadata = {
  title: "About NE Dhanya Tour and Travels | Northeast India Travel Specialists",
  description: "Learn about NE Dhanya Tour and Travels, your trusted travel partner for Assam, Meghalaya, Arunachal Pradesh, Sikkim & Bhutan.",
  alternates: {
    canonical: "/about-us",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutUsPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = createWhatsAppLink(settings.whatsappNumber, getGeneralEnquiryMessage());

  return (
    <div className="pt-24 pb-20 bg-nature-bg min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "About Us", url: "/about-us" }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Our Story & Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 font-heading">
            About NE Dhanya Tour and Travels
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Your Trusted Travel Partner for Northeast India & Bhutan
          </p>
        </div>

        {/* Narrative Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                Authentic Northeast Travel Grounded in Trust
              </h2>
              <p>
                <strong>NE Dhanya Tour and Travels</strong> was founded with a singular purpose: to make the majestic landscapes, rich tribal cultures, and misty mountains of Northeast India and Bhutan seamlessly accessible to travelers from all over India and the world.
              </p>
              <p>
                Headquartered in Guwahati, Assam—the natural gateway to the Seven Sister states—we understand that traveling in Northeast India is fundamentally different from traveling in the plains. Mountain roads, fluctuating weather, seasonal permits, and remote valleys require genuine local expertise and reliable on-ground vehicle support.
              </p>
              <p>
                Whether you desire a <strong>private, customized family tour</strong> in an Innova Crysta or a <strong>budget-friendly sharing tour</strong> to explore Meghalaya or Tawang, we ensure high standards of safety, cleanliness, and hospitality.
              </p>
            </div>

            <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"
                alt="Northeast India scenic landscapes - NE Dhanya Tour and Travels"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Local Ground Expertise</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We live and work here. We know the current road conditions between Guwahati, Shillong, Tawang, and Gangtok before your vehicle departs.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Personal & Sharing Travel</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We believe travel should be accessible to everyone. We cater to luxury family vacations as well as budget-conscious solo explorers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Hidden Charges</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Transparent quotations on WhatsApp. All driver allowances, fuel, and standard tolls are clearly outlined before booking.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-forest-900 text-white p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
            Connect With Our Travel Founders on WhatsApp
          </h2>
          <p className="text-xs sm:text-base text-slate-200 mt-3 max-w-lg mx-auto">
            Have questions about permits, best travel months, or custom itineraries? We are here to help.
          </p>
          <div className="mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
