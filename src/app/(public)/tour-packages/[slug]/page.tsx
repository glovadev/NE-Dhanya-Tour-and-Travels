import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, 
  MapPin, 
  Car, 
  Check, 
  X, 
  Building2, 
  ShieldCheck, 
  Calendar,
  Users
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getPackageBySlug, getSiteSettings } from "@/lib/firebase/dataBridge";
import { createWhatsAppLink, getPackageEnquiryMessage } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { FAQAccordion } from "@/components/public/FAQAccordion";

interface Props {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackageBySlug(params.slug);
  if (!pkg) return {};

  return {
    title: pkg.seoTitle || `${pkg.name} (${pkg.duration}) | NE Dhanya Tour and Travels`,
    description: pkg.seoDescription || pkg.shortDescription,
    alternates: {
      canonical: `/tour-packages/${pkg.slug}`,
    },
    openGraph: {
      title: pkg.seoTitle || `${pkg.name} | Northeast Tour`,
      description: pkg.seoDescription || pkg.shortDescription,
      images: [{ url: pkg.heroImage, alt: pkg.name }],
    },
  };
}

export default async function TourPackageDetailPage({ params }: Props) {
  const pkg = await getPackageBySlug(params.slug);
  if (!pkg) {
    notFound();
  }

  const settings = await getSiteSettings();
  const whatsappUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getPackageEnquiryMessage(pkg.name, pkg.duration, pkg.travelMode)
  );

  return (
    <div className="bg-nature-bg min-h-screen">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={pkg.heroImage}
            alt={pkg.name}
            fill
            priority
            className="object-cover object-center brightness-[0.38]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              📍 {pkg.destinationName}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
              ⏱ {pkg.duration}
            </span>
            {pkg.travelMode === "both" ? (
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Personal & Sharing Available
              </span>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {pkg.travelMode === "personal" ? "Personal Private Tour" : "Sharing Tour"}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading">
            {pkg.name}
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {pkg.shortDescription}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Get Customized Quote on WhatsApp</span>
            </a>
            <a
              href="#itinerary"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <span>View Day-by-Day Plan</span>
            </a>
          </div>

        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Breadcrumbs
          items={[
            { name: "Tour Packages", url: "/tour-packages" },
            { name: pkg.name, url: `/tour-packages/${pkg.slug}` },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Highlights Banner */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 font-heading">
              Tour Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
              {pkg.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary Section */}
        <section id="itinerary" className="scroll-mt-24">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Day-by-Day Schedule
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
              Detailed Tour Itinerary
            </h2>
          </div>

          <div className="space-y-4">
            {pkg.itinerary.map((day) => (
              <div
                key={day.day}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6"
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-forest-800 text-white flex flex-col items-center justify-center font-bold">
                    <span className="text-[10px] uppercase font-semibold text-emerald-300">Day</span>
                    <span className="text-xl">{day.day}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {day.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {day.description}
                  </p>
                  {day.nightStay && (
                    <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Overnight Stay: {day.nightStay}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">✓</span>
              <span>What&apos;s Included</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              {pkg.inclusions.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">✕</span>
              <span>What&apos;s Excluded</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              {pkg.exclusions.map((exc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Vehicle & Hotel Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-forest-50/70 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2 text-forest-800 font-bold text-base">
              <Car className="w-5 h-5 text-emerald-600" />
              <span>Available Vehicle Options</span>
            </div>
            <p className="text-xs text-slate-600">
              Choose your preferred travel vehicle based on group size:
            </p>
            <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700 font-medium">
              {pkg.vehicleOptions.map((v, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-100/60 shadow-sm">
                  🚗 {v}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border border-amber-100 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Stay & Accommodation Categories</span>
            </div>
            <p className="text-xs text-slate-600">
              Handpicked, verified clean hotels and authentic mountain homestays:
            </p>
            <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700 font-medium">
              {pkg.hotelOptions.map((h, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-amber-100/60 shadow-sm">
                  🏨 {h}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FAQs */}
        {pkg.faqs && pkg.faqs.length > 0 && (
          <FAQAccordion faqs={pkg.faqs} title={`${pkg.name} FAQs`} />
        )}

        {/* WhatsApp Quote Banner */}
        <div className="rounded-3xl bg-forest-900 text-white p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
            Get Your Custom Quote for {pkg.name}
          </h2>
          <p className="text-xs sm:text-base text-slate-200 mt-2 max-w-xl mx-auto">
            Tell us your travel dates and group size. We will provide an instant, transparent quote with vehicle options on WhatsApp.
          </p>
          <div className="mt-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-4 px-10 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base shadow-2xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>Get Customized Quote on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
