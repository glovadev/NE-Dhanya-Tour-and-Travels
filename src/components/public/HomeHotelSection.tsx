"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  Check, 
  Bed, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Hotel
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { HotelBookingModal } from "@/components/public/HotelBookingModal";

interface HomeHotelSectionProps {
  whatsappNumber: string;
}

export const HomeHotelSection: React.FC<HomeHotelSectionProps> = ({ whatsappNumber }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-24 text-white relative overflow-hidden bg-slate-950">
        
        {/* Cinematic Resort Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/bpi3s64e/image/upload/v1790142043/ne_dhaniya_tours/hotel-resort-bg.jpg"
            alt="Luxury Mountain Resort & Boutique Cottages in Northeast India"
            fill
            className="object-cover object-center brightness-[0.45] contrast-[1.08] scale-105 transition-transform duration-1000"
          />
          {/* Premium cinematic overlays for high contrast and elegance */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-forest-950/25 to-slate-950/75" />
        </div>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
              Verified Stays & Homestays
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 font-heading leading-tight">
              Complete Hotel Booking Assistance Across Northeast India & Bhutan
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              From peaceful riverside camps in Dawki and heritage tea estate bungalows in Assam to cozy mountain cottages in Tawang and luxury resorts in Shillong.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Check className="w-4 h-4" /> Budget & Deluxe Stays
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Check className="w-4 h-4" /> Verified Clean Bathrooms
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Check className="w-4 h-4" /> Family & Couple Friendly
              </span>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Specify Persons
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-emerald-400" /> Choose Rooms
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Pick Destination
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Select Travel Date
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current text-white" />
              <span>Book Hotels & Stays</span>
            </button>

            <Link
              href="/hotel-booking"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all text-center"
            >
              <Building2 className="w-4 h-4 text-emerald-300" />
              <span>Explore Stays Guide</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Modal Popup with all 4 details: Number of Person, Number of Room, Destination, Date */}
      <HotelBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
};
