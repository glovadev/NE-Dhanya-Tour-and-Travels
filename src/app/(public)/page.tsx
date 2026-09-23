import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Compass, 
  MapPin, 
  Phone, 
  Car, 
  ShieldCheck, 
  Calendar, 
  Award, 
  ArrowRight, 
  Building2, 
  CheckCircle,
  Users,
  Check
} from "lucide-react";
import { 
  getSiteSettings, 
  getAllDestinations, 
  getAllPackages, 
  getAllVehicles, 
  getAllBlogPosts,
  getAllTouristPlaces
} from "@/lib/firebase/dataBridge";
import { createWhatsAppLink, getGeneralEnquiryMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { TripSearchWidget } from "@/components/public/TripSearchWidget";
import { TrustSection } from "@/components/public/TrustSection";
import { DestinationCard } from "@/components/public/DestinationCard";
import { PackageCard } from "@/components/public/PackageCard";
import { PersonalVsSharing } from "@/components/public/PersonalVsSharing";
import { VehicleCard } from "@/components/public/VehicleCard";
import { FAQAccordion } from "@/components/public/FAQAccordion";
import { TestimonialSlider } from "@/components/public/TestimonialSlider";
import { HomeHotelSection } from "@/components/public/HomeHotelSection";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [settings, destinations, packages, vehicles, blogs, places] = await Promise.all([
    getSiteSettings(),
    getAllDestinations(),
    getAllPackages(),
    getAllVehicles(),
    getAllBlogPosts(),
    getAllTouristPlaces()
  ]);

  const heroWhatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    "Hello NE Dhanya Tour and Travels, I want to plan my trip to Northeast India & Bhutan. Please assist me."
  );

  const homeFaqs = [
    {
      question: "Why choose NE Dhanya Tour and Travels for Northeast India trips?",
      answer: "We are local Northeast travel specialists with deep on-ground knowledge across Assam, Meghalaya, Arunachal Pradesh, Sikkim, Nagaland, and Bhutan. We provide well-maintained private vehicles, verified drivers with mountain driving expertise, customized itineraries, hotel bookings, and 24/7 support on WhatsApp."
    },
    {
      question: "What is the difference between your Personal and Sharing tours?",
      answer: "Personal tours provide a dedicated private vehicle exclusively for your group, giving you total freedom over halts, photography, and departure timings (ideal for families and couples). Sharing tours are budget-friendly options where solo travelers or students book individual seats in a shared vehicle along a fixed popular route."
    },
    {
      question: "How do I book a tour package or vehicle with NE Dhanya?",
      answer: "Booking is simple and fast! Simply select your preferred package, destination, or vehicle on our website and click 'Plan My Trip on WhatsApp'. Our travel coordinator will share an exact itinerary, vehicle details, and quotation directly in chat."
    },
    {
      question: "Do you arrange Inner Line Permits (ILP) and Bhutan entry permits?",
      answer: "Yes, we provide full assistance for Inner Line Permits (ILP) for Arunachal Pradesh, Nagaland, and Mizoram, as well as Bhutan immigration permits and Bumla Pass army clearances."
    },
    {
      question: "Can you arrange custom pick-ups from Guwahati Airport or Railway Station?",
      answer: "Yes! All our tours and car rentals can start directly with dedicated pick-up from Lokpriya Gopinath Bordoloi International Airport (GAU) or Guwahati Railway Station."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
        
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/bpi3s64e/image/upload/v1790142138/ne_dhaniya_tours/northeast-hero-bg.jpg"
            alt="Scenic Northeast India Himalayas, Tea Valleys, Waterfalls & Mountain Roads"
            fill
            priority
            className="object-cover object-center brightness-[0.52] contrast-[1.06] scale-105 transition-transform duration-1000"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-forest-950/35 to-black/55" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-6">
          
          {/* Trust Badge Header */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Northeast India & Bhutan Travel Specialist</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-lg font-heading">
            Explore Northeast India & Bhutan <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300">
              Like Never Before
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-5 text-sm sm:text-lg text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow">
            Tour Packages • Private & Sharing Tours • Car Rental • Hotel Booking
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={heroWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-full bg-forest-600 hover:bg-forest-500 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current text-white" />
              <span>Plan My Trip on WhatsApp</span>
            </a>

            <Link
              href="/destinations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-white/30 transition-all hover:border-white/60"
            >
              <Compass className="w-5 h-5 text-amber-300" />
              <span>Explore Destinations</span>
            </Link>
          </div>

          {/* Trip Planner Widget */}
            <TripSearchWidget 
              whatsappNumber={settings.whatsappNumber} 
              destinations={destinations}
              places={places}
            />

        </div>

      </section>

      {/* 2. TRUST SECTION */}
      <TrustSection />

      {/* 3. VEHICLE FLEET */}
      <section className="py-20 bg-nature-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Modern Travel Vehicles
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
                Our Fleet for Northeast Road Travel
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Well-maintained, sanitized, and commercial-permit vehicles driven by seasoned mountain drivers.
              </p>
            </div>

            <Link
              href="/car-rental"
              className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900 self-start md:self-auto"
            >
              <span>Explore Car Rental Rates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
      </section>

      {/* 4. POPULAR TOUR PACKAGES */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Curated Travel Itineraries
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
                Popular Tour Packages
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Carefully planned journeys featuring comfortable transport, handpicked stays, and local support. Available in Personal and Sharing modes.
              </p>
            </div>

            <Link
              href="/tour-packages"
              className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900 self-start md:self-auto"
            >
              <span>Browse All Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 6).map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                whatsappNumber={settings.whatsappNumber} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* 5. DESTINATIONS SECTION (8 Regions) */}
      <section className="py-20 bg-nature-bg border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Where Adventures Begin
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
              Explore Northeast India & Bhutan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Discover breathtaking mountains, valleys, waterfalls, wildlife, monasteries and vibrant cultures across 8 iconic regions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-forest-800 text-white font-semibold text-sm hover:bg-forest-900 transition-all shadow-md hover:shadow-lg"
            >
              <span>View All Northeast Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. PERSONAL VS SHARING COMPARISON */}
      <PersonalVsSharing whatsappNumber={settings.whatsappNumber} />

      {/* 7. WHY CHOOSE NE DHANYA (Section 58) */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              The NE Dhanya Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
              Why Choose NE Dhanya Tour and Travels
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              We focus 100% on Northeast India and Bhutan, ensuring you get authentic local care, honest advice, and comfortable mountain travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Northeast Specialists</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Focused exclusively on Northeast India and Bhutan travel. Our local team understands road conditions, mountain seasons, and cultural nuances.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Flexible Travel</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose private vehicle comfort for families and couples, or join budget-friendly sharing tours to explore economically.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Complete Travel Assistance</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tours + Vehicles + Stays in one place. We coordinate everything from Guwahati airport transfers to permit clearances.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Comfortable Vehicles</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                From luxury Force Urbania vans and Innova Crystas to tempo travelers and sedans, we have the right vehicle for every group size.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Customized Trips</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No rigid, pre-packaged limits. We tailor every itinerary around your pace, travel dates, family interests, and preferences.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#25D366] flex items-center justify-center mb-5">
                <WhatsAppIcon className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Easy WhatsApp Booking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enquire, discuss itineraries, and get transparent quotes directly on WhatsApp with quick responses from our travel coordinators.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 8. TESTIMONIALS SLIDER SECTION */}
      <TestimonialSlider whatsappNumber={settings.whatsappNumber} />

      {/* 9. HOTEL BOOKING HIGHLIGHT (Section 22) */}
      <HomeHotelSection whatsappNumber={settings.whatsappNumber} />

      {/* 9. TRAVEL GUIDE / BLOG PREVIEW (Section 26) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Northeast Travel Knowledge
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
                Latest Travel Guides & Articles
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Authentic insights, route guides, permit rules, and seasonal tips to help you plan your Northeast adventure.
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900 self-start md:self-auto"
            >
              <span>Read All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog) => (
              <div key={blog.id} className="group rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-800">
                    {blog.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-forest-700 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                    <Link href={`/blog/${blog.slug}`} className="flex items-center gap-1 group-hover:underline">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-slate-400 font-normal">{blog.readingTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <FAQAccordion faqs={homeFaqs} />

      {/* 11. FINAL CONVERSION BANNER */}
      <section className="py-20 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Start Your Journey Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-5 font-heading tracking-tight">
            Planning a Northeast Trip? <br />
            Talk to Our Travel Team on WhatsApp
          </h2>
          <p className="text-sm sm:text-base text-slate-200 mt-4 max-w-xl mx-auto leading-relaxed">
            Get personalized itineraries, vehicle availability, hotel recommendations, and honest advice with zero booking friction.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={heroWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-4 px-10 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current text-white" />
              <span>Plan My Trip on WhatsApp</span>
            </a>
            <a
              href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>Call {settings.phoneNumber}</span>
            </a>
            {settings.secondaryPhoneNumber && (
              <a
                href={`tel:${settings.secondaryPhoneNumber.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-300" />
                <span>Call {settings.secondaryPhoneNumber}</span>
              </a>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
