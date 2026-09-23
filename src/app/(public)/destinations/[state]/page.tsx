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
  ShieldCheck, 
  Check, 
  ArrowRight,
  Compass
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { 
  getDestinationBySlug, 
  getTouristPlacesByDestination, 
  getPackagesByDestination, 
  getAllVehicles, 
  getSiteSettings 
} from "@/lib/firebase/dataBridge";
import { createWhatsAppLink, getDestinationEnquiryMessage } from "@/lib/whatsapp";
import { getTouristDestinationSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { PackageCard } from "@/components/public/PackageCard";
import { FAQAccordion } from "@/components/public/FAQAccordion";

interface Props {
  params: {
    state: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dest = await getDestinationBySlug(params.state);
  if (!dest) return {};

  return {
    title: dest.seoTitle || `${dest.name} Tour Packages, Taxi & Travel Services | NE Dhanya`,
    description: dest.seoDescription || dest.shortDescription,
    alternates: {
      canonical: `/destinations/${dest.slug}`,
    },
    openGraph: {
      title: dest.seoTitle || `${dest.name} Tours | NE Dhanya Tour and Travels`,
      description: dest.seoDescription || dest.shortDescription,
      images: [{ url: dest.heroImage, alt: `${dest.name} Tourism` }],
    },
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const dest = await getDestinationBySlug(params.state);
  if (!dest) {
    notFound();
  }

  const places = await getTouristPlacesByDestination(dest.slug);
  const packages = await getPackagesByDestination(dest.slug);
  const vehicles = await getAllVehicles();
  const settings = await getSiteSettings();

  const destinationSchema = getTouristDestinationSchema(dest);
  const whatsappUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getDestinationEnquiryMessage(dest.name)
  );

  return (
    <div className="bg-nature-bg min-h-screen">
      
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={dest.heroImage}
            alt={`${dest.name} Tours & Taxi Services`}
            fill
            priority
            className="object-cover object-center brightness-[0.38]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Northeast Destination Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading">
            {dest.name} Tour Packages & Travel Services
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {dest.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Plan {dest.name} Trip on WhatsApp</span>
            </a>
            <a
              href="#places"
              className="inline-flex items-center gap-2 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              <span>Explore Places</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Breadcrumbs
          items={[
            { name: "Destinations", url: "/destinations" },
            { name: dest.name, url: `/destinations/${dest.slug}` },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* 2. ABOUT DESTINATION */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Overview & Culture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
              About {dest.name}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              {dest.description}
            </p>
          </div>

          {/* Key Facts Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase">Best Time</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">{dest.bestTimeToVisit}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase">Travel Modes</span>
              <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-1">Personal Private Cabs & Sharing Tours</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase">Gateway Airport</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Guwahati (GAU) / Regional Hub</p>
            </div>
          </div>
        </section>

        {/* 3. POPULAR TOURIST PLACES (Grid of place pages) */}
        <section id="places" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Must-Visit Sights
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
                Top Tourist Places in {dest.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div
                key={place.id}
                className="group rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={place.heroImage}
                    alt={`${place.name}, ${dest.name} Travel`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold drop-shadow">{place.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {place.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href={`/destinations/${dest.slug}/${place.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-forest-50 text-forest-800 hover:bg-forest-800 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <span>{place.name} Travel Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* List of other all tourist places under the state as internal tags */}
          {dest.popularPlaces && dest.popularPlaces.length > 0 && (
            <div className="mt-8 p-6 rounded-2xl bg-white border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                All Major Tourist Destinations in {dest.name}:
              </span>
              <div className="flex flex-wrap gap-2">
                {dest.popularPlaces.map((p, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    📍 {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 4. PACKAGES IN THIS DESTINATION */}
        {packages.length > 0 && (
          <section>
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Curated Packages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
                Popular {dest.name} Tour Packages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

        {/* 5. TRAVEL LOGISTICS: HOW TO REACH & TIPS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* How to reach */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Connectivity
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                How to Reach {dest.name}
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Plane className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">By Air:</strong>
                  <span>{dest.howToReach?.byAir || "Regular domestic and regional flights connect to nearby airport hubs."}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Train className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">By Rail:</strong>
                  <span>{dest.howToReach?.byRail || "Well-connected railhead junctions provide pan-India train access."}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">By Road / Taxi:</strong>
                  <span>{dest.howToReach?.byRoad || "Extensive national highways and state scenic corridors connect all destinations."}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Travel Tips & Permits */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Important Travel Advice
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Permits & Practical Tips
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              {(dest.travelTips || [
                "Carry valid photo ID (Voter ID or Passport) for state entry and permit checks.",
                "Dress in comfortable mountain layers as evening temperatures drop pleasantly.",
                "Book dedicated cabs or sharing tours in advance for smooth transfers."
              ]).map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Permit Assistance:</strong> NE Dhanya Tour and Travels arranges Inner Line Permits (ILP) and entry passes for all our booked travelers.
              </span>
            </div>
          </div>

        </section>

        {/* 6. FAQS */}
        <FAQAccordion
          faqs={dest.faqs}
          title={`${dest.name} Travel FAQs`}
          subtitle={`Common questions regarding permits, cabs, itineraries, and best seasons in ${dest.name}.`}
        />

        {/* 7. BOTTOM CONVERSION CTA BANNER */}
        <div className="rounded-3xl bg-gradient-to-r from-forest-900 to-forest-950 text-white p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
            Planning a {dest.name} Trip? Talk to Our Travel Team
          </h2>
          <p className="text-xs sm:text-base text-slate-200 mt-3 max-w-xl mx-auto leading-relaxed">
            Get personalized itineraries, taxi options, and verified hotel stays tailored to your budget and travel pace.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Plan {dest.name} Trip on WhatsApp</span>
            </a>
            <Link
              href="/car-rental"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <Car className="w-4 h-4 text-emerald-300" />
              <span>Check {dest.name} Taxi Rates</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
