import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { 
  Car, 
  ShieldCheck, 
  Plane, 
  MapPin, 
  Users, 
  Check, 
  ArrowRight,
  Phone
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getAllVehicles, getSiteSettings } from "@/lib/firebase/dataBridge";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { VehicleCard } from "@/components/public/VehicleCard";
import { createWhatsAppLink, getVehicleEnquiryMessage } from "@/lib/whatsapp";
import { FAQAccordion } from "@/components/public/FAQAccordion";

export const metadata: Metadata = {
  title: "Car Rental in Northeast India | Taxi Service & Outstation Cabs | NE Dhanya",
  description: "Book reliable car rentals in Northeast India. Innova Crysta, Force Urbania, Tempo Traveler & Sedans for Meghalaya, Assam, Tawang, Sikkim & Bhutan with local mountain drivers.",
  alternates: {
    canonical: "/car-rental",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CarRentalPage() {
  const vehicles = await getAllVehicles();
  const settings = await getSiteSettings();

  const generalCabWhatsApp = createWhatsAppLink(
    settings.whatsappNumber,
    "Hello NE Dhanya Tour and Travels, I want to enquire about car rental / taxi service in Northeast India. Please share rates."
  );

  const carRentalFaqs = [
    {
      question: "Are your drivers experienced with high-altitude mountain routes?",
      answer: "Yes, all our drivers are verified local professionals with extensive experience navigating steep gradients, fog, and mountain roads in Tawang, Sela Pass, North Sikkim, and Meghalaya."
    },
    {
      question: "Can I book Guwahati Airport pickup to Shillong or Kaziranga?",
      answer: "Absolutely! We provide dedicated, punctual pickups right from Guwahati Airport (GAU) or Guwahati Railway Station directly to your hotel or destination."
    },
    {
      question: "What is included in the car rental rates?",
      answer: "Our quotations clearly include the vehicle, professional driver allowance, fuel, and all standard state toll and parking taxes. There are no hidden charges."
    },
    {
      question: "Which vehicle is best suited for 8 to 15 passengers?",
      answer: "For groups of 8 to 17 passengers, our Force Urbania (luxury reclining van) or Force Traveler (13/17/26 Seater) are ideal, offering ample legroom, dual AC, and heavy-duty luggage carriers."
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-nature-bg min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Car Rental", url: "/car-rental" }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Reliable Mountain Fleet
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 font-heading">
            Car Rental in Northeast India
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Comfortable, well-maintained vehicles driven by experienced local drivers. Dedicated outstation cabs, Guwahati airport transfers, multi-day road trips, and group touring buses.
          </p>
        </div>

        {/* Fleet Showcase */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                Our Complete Vehicle Fleet
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose the perfect vehicle for your group size and terrain requirements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                whatsappNumber={settings.whatsappNumber}
              />
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Tailored Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
              Our Car Rental & Transportation Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Airport & Railway Transfers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Punctual flight-tracking pick-up and drop-off from Guwahati Airport (GAU), Dibrugarh, or Bagdogra directly to your resort.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Outstation Multi-Day Tours</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated vehicle and driver assigned exclusively to your group for the entire duration of your multi-state tour.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Group & Wedding Travel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deluxe and luxury 22/24 seater coaches and Force Urbanias for corporate delegations, family unions, and weddings.
              </p>
            </div>

          </div>
        </div>

        {/* State-Specific Taxi Service Links (SEO Authority) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 font-heading">
            Popular State Taxi & Car Rental Routes:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
            <Link href="/destinations/meghalaya" className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-100 transition-colors flex items-center justify-between">
              <span>🚗 Car Rental in Meghalaya (Shillong, Cherrapunji)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link href="/destinations/assam" className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-100 transition-colors flex items-center justify-between">
              <span>🚗 Car Rental in Assam (Guwahati, Kaziranga)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link href="/destinations/arunachal-pradesh" className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-100 transition-colors flex items-center justify-between">
              <span>🚗 Car Rental in Arunachal Pradesh (Tawang, Dirang)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link href="/destinations/sikkim" className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-100 transition-colors flex items-center justify-between">
              <span>🚗 Car Rental in Sikkim (Gangtok, North Sikkim)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link href="/destinations/nagaland" className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-100 transition-colors flex items-center justify-between">
              <span>🚗 Car Rental in Nagaland (Kohima, Dimapur)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link href="/destinations/bhutan" className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-100 transition-colors flex items-center justify-between">
              <span>🚗 Bhutan Tourist Vehicle Transfers from Assam</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <FAQAccordion faqs={carRentalFaqs} title="Northeast Car Rental FAQs" />

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-forest-900 text-white p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
            Need a Cab for Your Northeast Trip?
          </h2>
          <p className="text-xs sm:text-base text-slate-200 mt-3 max-w-xl mx-auto leading-relaxed">
            Get instant vehicle availability and transparent rates directly on WhatsApp.
          </p>
          <div className="mt-8">
            <a
              href={generalCabWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Book Vehicle on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
