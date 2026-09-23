import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  Plane, 
  Train, 
  Car, 
  Check, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { 
  getDestinationBySlug, 
  getTouristPlaceBySlug, 
  getPackagesByDestination, 
  getSiteSettings 
} from "@/lib/firebase/dataBridge";
import { createWhatsAppLink, getDestinationEnquiryMessage } from "@/lib/whatsapp";
import { getTouristAttractionSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { PackageCard } from "@/components/public/PackageCard";
import { FAQAccordion } from "@/components/public/FAQAccordion";

interface Props {
  params: {
    state: string;
    place: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const place = await getTouristPlaceBySlug(params.state, params.place);
  if (!place) return {};

  return {
    title: place.seoTitle || `${place.name} Tour & Travel Guide | Taxi & Stays | NE Dhanya`,
    description: place.seoDescription || place.shortDescription,
    alternates: {
      canonical: `/destinations/${place.destinationSlug}/${place.slug}`,
    },
    openGraph: {
      title: place.seoTitle || `${place.name} Travel Guide | NE Dhanya Tour and Travels`,
      description: place.seoDescription || place.shortDescription,
      images: [{ url: place.heroImage, alt: `${place.name} Sightseeing` }],
    },
  };
}

export default async function TouristPlaceDetailPage({ params }: Props) {
  const dest = await getDestinationBySlug(params.state);
  const place = await getTouristPlaceBySlug(params.state, params.place);

  if (!dest || !place) {
    notFound();
  }

  const packages = await getPackagesByDestination(dest.slug);
  const settings = await getSiteSettings();
  const attractionSchema = getTouristAttractionSchema(place);

  const placeWhatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    `Hello NE Dhanya Tour and Travels, I am planning to visit ${place.name}, ${dest.name}. Please share travel packages, taxi fares, and hotel recommendations.`
  );

  return (
    <div className="bg-nature-bg min-h-screen">
      
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={place.heroImage}
            alt={`${place.name} Sightseeing & Taxi Service`}
            fill
            priority
            className="object-cover object-center brightness-[0.38]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>{dest.name} Tourism</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading">
            {place.name} Tour & Travel Guide
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {place.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={placeWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Book {place.name} Trip on WhatsApp</span>
            </a>
            <Link
              href={`/destinations/${dest.slug}`}
              className="inline-flex items-center gap-2 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              <span>Back to {dest.name}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Breadcrumbs
          items={[
            { name: "Destinations", url: "/destinations" },
            { name: dest.name, url: `/destinations/${dest.slug}` },
            { name: place.name, url: `/destinations/${dest.slug}/${place.slug}` },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* About Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Destination Insights
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
              About {place.name}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              {place.description}
            </p>
          </div>
        </section>

        {/* Top Things to Do */}
        {place.topThingsToDo && place.topThingsToDo.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Activities & Attractions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
              Top Things to Do in {place.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {place.topThingsToDo.map((todo, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">{todo}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Taxi Service & Transportation */}
        <section className="rounded-3xl bg-forest-950 text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Reliable Ground Transport
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 font-heading">
              {place.name} Taxi Service & Private Car Rental
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              Need a cab from Guwahati to {place.name}, or full local sightseeing? NE Dhanya Tour and Travels operates verified Innova Crystas, Sedans, and Force Travelers with seasoned mountain drivers.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={placeWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-xl transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>Get {place.name} Taxi Fare on WhatsApp</span>
              </a>
              <Link
                href="/car-rental"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
              >
                <Car className="w-4 h-4 text-emerald-300" />
                <span>View Full Fleet</span>
              </Link>
            </div>
          </div>
        </section>

        {/* How to reach & Practical information */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Transit & Timing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
              How to Reach & Best Time to Visit {place.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <h3 className="font-bold text-slate-900 text-base">Transportation Routes:</h3>
              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>By Air:</strong> {place.howToReach?.byAir || "Nearest airport connectivity with taxi transfers available."}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Train className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>By Rail:</strong> {place.howToReach?.byRail || "Nearest railway junction connecting major cities."}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>By Road:</strong> {place.howToReach?.byRoad || "Comfortable highway and mountain route with scenic views."}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <h3 className="font-bold text-slate-900 text-base">Best Seasons & Tips:</h3>
              <p><strong>Recommended Timing:</strong> {place.bestTimeToVisit}</p>
              {place.travelTips && place.travelTips.length > 0 && (
                <ul className="space-y-2 pt-2">
                  {place.travelTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Related Tour Packages */}
        {packages.length > 0 && (
          <section>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Tour Packages Including {place.name}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
                Recommended Itineraries
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  whatsappNumber={settings.whatsappNumber}
                />
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        <FAQAccordion
          faqs={place.faqs}
          title={`${place.name} Travel FAQs`}
          subtitle={`Frequently asked questions about sightseeing, taxi booking, and stays in ${place.name}.`}
        />

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-forest-900 text-white p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Ready to Explore {place.name}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-lg mx-auto">
            Contact NE Dhanya Tour and Travels on WhatsApp for customized itineraries, direct cab bookings, and friendly advice.
          </p>
          <div className="mt-6">
            <a
              href={placeWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
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
