"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  Star,
  Coffee,
  Waves,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Bed,
  ArrowRight
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { HotelBookingModal } from "@/components/public/HotelBookingModal";
import { HotelBookingWidget } from "@/components/public/HotelBookingWidget";
import { FAQAccordion } from "@/components/public/FAQAccordion";

interface HotelBookingClientProps {
  whatsappNumber: string;
}

const stayCategories = [
  {
    title: "Luxury Mountain Resorts",
    categoryKey: "Luxury Mountain Resort",
    description: "Picturesque valley-facing luxury resorts in Shillong, Kaziranga tea estates, and Gangtok offering panoramic vistas and world-class amenities.",
    icon: <Sparkles className="w-5 h-5 text-amber-500" />
  },
  {
    title: "Authentic Local Homestays",
    categoryKey: "Authentic Local Homestay",
    description: "Experience genuine Khasi, Assamese, and Monpa hospitality with home-cooked traditional meals and cultural immersion in Cherrapunji, Mawlynnong, and Dirang.",
    icon: <Coffee className="w-5 h-5 text-emerald-600" />
  },
  {
    title: "Riverside Camps & Eco Tents",
    categoryKey: "Riverside Camp / Eco Tents",
    description: "Pebble beach riverside camping along the crystal clear Umngot river in Shnongpdeng (Dawki), complete with bonfires and starry night skies.",
    icon: <Waves className="w-5 h-5 text-teal-600" />
  },
  {
    title: "Comfortable Family Hotels",
    categoryKey: "Comfortable Family Hotel",
    description: "Centrally located, safe, and spacious accommodations with elevators, in-house dining, and parking in Guwahati, Shillong, and Gangtok.",
    icon: <Building2 className="w-5 h-5 text-emerald-600" />
  },
  {
    title: "Honeymoon Boutique Cottages",
    categoryKey: "Boutique Honeymoon Cottage",
    description: "Secluded, romantic wooden cottages nestled amidst pine forests with private balconies and scenic mountain mist views.",
    icon: <Star className="w-5 h-5 text-rose-500" />
  },
  {
    title: "Budget & Sharing Hostels",
    categoryKey: "Budget / Sharing Room",
    description: "Clean, reliable, and verified budget-friendly rooms for solo backpackers, students, and sharing tour travelers.",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
  }
];

const popularDestinations = [
  { name: "Shillong & Umiam Lake", state: "Meghalaya" },
  { name: "Cherrapunji (Sohra)", state: "Meghalaya" },
  { name: "Dawki & Shnongpdeng", state: "Meghalaya" },
  { name: "Kaziranga Jungle Resorts", state: "Assam" },
  { name: "Tawang & Dirang Valley", state: "Arunachal Pradesh" },
  { name: "Gangtok & Lachung", state: "Sikkim" },
  { name: "Thimphu & Paro", state: "Bhutan" },
  { name: "Kohima & Dzukou Camps", state: "Nagaland" }
];

const hotelFaqs = [
  {
    question: "Why book hotels through NE Dhanya Tour and Travels instead of generic booking portals?",
    answer: "Many remote locations in Northeast India (like Cherrapunji, Dawki, North Sikkim, and Tawang) have limited hotel inventory where online photos are often outdated. Our team personally inspects each property to verify water heating, hygiene, road accessibility, and food quality."
  },
  {
    question: "Are homestays in Northeast India safe and comfortable?",
    answer: "Yes! Homestays in Meghalaya, Arunachal Pradesh, and Assam are celebrated for their warmth, cleanliness, and safety. Host families provide private clean bathrooms, cozy bedding, and freshly cooked local meals."
  },
  {
    question: "Can you combine hotel booking with car rental and sightseeing?",
    answer: "Yes, our most popular packages bundle seamless hotel stays with dedicated private vehicles or sharing tour seats, saving you time and money."
  }
];

export const HotelBookingClient: React.FC<HotelBookingClientProps> = ({ whatsappNumber }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("Any Verified Clean Stay");
  const [modalDestination, setModalDestination] = useState("Shillong & Umiam Lake (Meghalaya)");

  const handleOpenModal = (category = "Any Verified Clean Stay", destination = "Shillong & Umiam Lake (Meghalaya)") => {
    setModalCategory(category);
    setModalDestination(destination);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-16">
        
        {/* Scenic Header Banner with Attractive Background Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 px-6 py-16 sm:px-12 sm:py-20 text-center text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://res.cloudinary.com/bpi3s64e/image/upload/v1790142043/ne_dhaniya_tours/hotel-resort-bg.jpg"
              alt="Luxury Resort and Homestays Northeast India"
              fill
              priority
              className="object-cover object-center brightness-[0.45] contrast-[1.05] scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/40 shadow-lg backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Handpicked Accommodations
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-4 font-heading tracking-tight drop-shadow-md">
              Hotel & Homestay Booking Assistance
            </h1>
            <p className="text-sm sm:text-lg text-slate-200 mt-4 leading-relaxed max-w-2xl mx-auto drop-shadow">
              Verified clean rooms, hot water geysers, scenic mountain views, riverside camps, and local homestays across Northeast India & Bhutan.
            </p>
          </div>
        </div>

        {/* Interactive Booking Widget taking: Destination, Number of Persons, Number of Rooms, and Date */}
        <div>
          <HotelBookingWidget whatsappNumber={whatsappNumber} />
        </div>

        {/* Categories Grid */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Explore Stays by Style
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Click on any category to book with specific details (Persons, Rooms, Date, Destination):
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stayCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-100 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-50 mt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(cat.categoryKey)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-forest-50 text-forest-800 hover:bg-forest-800 hover:text-white text-xs font-semibold transition-all group-hover:shadow-sm"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                    <span>Book {cat.title}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stays by Destination */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Popular Hotel Booking Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your destination below to book verified stays:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularDestinations.map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleOpenModal("Any Verified Clean Stay", `${d.name} (${d.state})`)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-300 text-left transition-all hover:scale-[1.02] group"
              >
                <MapPin className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-900">
                  {d.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {d.state}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <FAQAccordion faqs={hotelFaqs} title="Northeast Hotel Booking FAQs" />

        {/* Bottom Banner */}
        <div className="rounded-3xl bg-forest-900 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
              Looking for Verified Stays for Your Dates?
            </h2>
            <p className="text-xs sm:text-base text-slate-200 mt-3 max-w-xl mx-auto leading-relaxed">
              Tell us your destination, dates, and number of guests. We will share verified options with photos and best rates directly on WhatsApp.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
                <span>Book Hotel with Trip Details</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Popup collecting: Number of Person, Number of Room, Destination, Date */}
      <HotelBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        whatsappNumber={whatsappNumber}
        defaultCategory={modalCategory}
        defaultDestination={modalDestination}
      />
    </>
  );
};
