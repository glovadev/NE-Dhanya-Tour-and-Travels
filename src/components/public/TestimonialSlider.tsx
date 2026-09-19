"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  CheckCircle, 
  MapPin, 
  Sparkles,
  Calendar,
  Car,
  PenSquare
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { getApprovedReviews } from "@/lib/firebase/dataBridge";
import { PutReviewModal } from "@/components/public/PutReviewModal";
import { Review } from "@/types";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  tourName: string;
  travelMode: string;
  highlight: string;
  review: string;
  date: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Dr. Anirban & Sreemoyee Roy",
    location: "Kolkata, West Bengal",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    tourName: "Meghalaya Scenic Escape (6D/5N)",
    travelMode: "Personal Private Tour",
    highlight: "Exceptional Innova Crysta & local driver Bimal Da!",
    review: "We booked our family Meghalaya tour with NE Dhanya Tour and Travels. From our airport pickup at Guwahati to Dawki boating and Cherrapunji waterfalls, the Innova Crysta was spotless and our driver was incredibly polite, punctual, and knowledgeable about mountain roads. Everything was coordinated directly on WhatsApp with zero stress!",
    date: "February 2025"
  },
  {
    id: "test-2",
    name: "Vikram & Neha Malhotra",
    location: "Gurugram / Delhi NCR",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    tourName: "Guwahati to Tawang Himalayan Circuit (8D/7N)",
    travelMode: "Personal Private Tour",
    highlight: "Flawless Sela Pass & Bumla permits support",
    review: "Driving to Tawang can be intimidating, but NE Dhanya Tour and Travels made it seamless. They arranged all our Arunachal ILP and Bumla Pass army permits in advance. Our vehicle climbed snowy Sela Pass without a single hitch. Honest pricing, warm hospitality, and 24/7 WhatsApp assistance throughout our road trip!",
    date: "January 2025"
  },
  {
    id: "test-3",
    name: "Pooja Hegde & Travel Group",
    location: "Bengaluru, Karnataka",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    tourName: "Assam Wildlife & Meghalaya Adventure (7D/6N)",
    travelMode: "Sharing Tour",
    highlight: "Super economical & luxury Force Urbania van",
    review: "A group of 12 friends booked the Force Urbania for Kaziranga rhino safari, Shillong, and Cherrapunji. The Urbania was so luxurious with push-back seats, individual AC vents, and USB charging points for everyone. We saved substantial money while traveling together in supreme comfort. Best travel team in Guwahati!",
    date: "December 2024"
  },
  {
    id: "test-4",
    name: "Col. Rajesh & Sunita Sharma",
    location: "Chandigarh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    tourName: "Bhutan Cultural Expedition via Assam (7D/6N)",
    travelMode: "Personal Private Tour",
    highlight: "Hassle-free Bhutan cross-border travel & stays",
    review: "We wanted to explore Bhutan entering directly via Samdrup Jongkhar from Guwahati. NE Dhanya Tour and Travels handled our vehicle entry permits, hotel accommodations, and seasoned hill driver. Climbing to Tiger's Nest in Paro and visiting Punakha Dzong was utterly unforgettable. Highly recommended for couples and seniors!",
    date: "March 2025"
  },
  {
    id: "test-5",
    name: "Debashis Mukherjee",
    location: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    tourName: "Guwahati Airport to Shillong & Cherrapunji Outstation",
    travelMode: "Outstation Car Rental",
    highlight: "Punctual airport pickup & pristine Dzire sedan",
    review: "Booked a sedan for 4 days covering Guwahati Airport, Maa Kamakhya Temple, Umiam Lake, and Cherrapunji. The driver arrived 15 minutes before landing at Guwahati with a welcome sign. Zero hidden charges, sanitized car, and very reasonable outstation taxi rates. Will always book with NE Dhanya Tour and Travels!",
    date: "November 2024"
  }
];

interface TestimonialSliderProps {
  whatsappNumber?: string;
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ whatsappNumber = "919678290128" }) => {
  const [items, setItems] = useState<Testimonial[]>(defaultTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadReviews = () => {
    getApprovedReviews().then((approved) => {
      if (approved && approved.length > 0) {
        const mapped: Testimonial[] = approved.map(r => ({
          id: r.id,
          name: r.name,
          location: r.location,
          avatar: r.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.name)}&backgroundColor=059669&textColor=ffffff`,
          rating: r.rating || 5,
          tourName: r.tourName || "Northeast Tour",
          travelMode: r.travelMode || "Personal Private Tour",
          highlight: r.highlight || "Delightful travel experience with NE Dhanya!",
          review: r.review,
          date: new Date(r.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
        }));
        setItems(mapped);
      }
    }).catch(err => {
      console.warn("Could not load dynamic reviews, using fallback", err);
    });
  };

  useEffect(() => {
    loadReviews();

    const handleUpdate = () => {
      loadReviews();
    };

    window.addEventListener("ne_dhanya_reviews_updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("ne_dhanya_reviews_updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-advance slider every 6 seconds if not hovered
  useEffect(() => {
    if (!isPaused && items.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex, items.length]);

  const current = items[currentIndex] || items[0] || defaultTestimonials[0];

  const planWhatsAppUrl = createWhatsAppLink(
    whatsappNumber,
    "Hello NE Dhanya Tour and Travels, I read your traveler reviews and would like to plan a trip with you. Please share details."
  );

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-emerald-50/40 relative overflow-hidden border-t border-slate-100">
      
      {/* Decorative Background Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-forest-100/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Real Traveler Stories</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-4 font-heading tracking-tight">
            Loved by Travelers Across India
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            See what families, couples, and group travelers say about our private vehicles, honest guidance, and on-ground Northeast care.
          </p>

          {/* Social Proof Badges & Put Review Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shadow-xs border border-slate-200/80">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-900 ml-1">4.9 / 5</span>
              <span className="text-slate-400 text-xs">({items.length * 75}+ Reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shadow-xs border border-slate-200/80">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Local Hill Drivers</span>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Put Review</span>
            </button>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Main Card with Smooth Fade / Slide */}
          <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 p-6 sm:p-10 lg:p-12 overflow-hidden">
            
            {/* Top Row: Quote Icon & Slide Counter */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                <Quote className="w-6 h-6 fill-current text-emerald-600 rotate-180" />
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Traveler
                </span>
              </div>
            </div>

            {/* Tour & Travel Mode Tag */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{current.tourName}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                <Car className="w-3 h-3 text-slate-500" />
                <span>{current.travelMode}</span>
              </span>
            </div>

            {/* Highlight Title */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading mb-3">
              &ldquo;{current.highlight}&rdquo;
            </h3>

            {/* Review Body */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed italic mb-8">
              &ldquo;{current.review}&rdquo;
            </p>

            {/* Reviewer Profile & Rating */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 flex-wrap gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-sm shrink-0">
                  <Image
                    src={current.avatar}
                    alt={current.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {current.name}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{current.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex text-amber-400">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" /> {current.date}
                </span>
              </div>
            </div>

          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center justify-between mt-8 px-2">
            
            {/* Left Button */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-center shadow-md transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Indicators (Slide One by One) */}
            <div className="flex items-center gap-2.5">
              {items.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-forest-800"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            {/* Right Button */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-center shadow-md transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Bottom CTA Box */}
        <div className="mt-14 max-w-2xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              Traveled with us recently?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Leave a review to share your feedback or chat with us for your next adventure.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-all"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Put Review</span>
            </button>
            <a
              href={planWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-forest-800 hover:bg-forest-900 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
              <span>Chat with Us</span>
            </a>
          </div>
        </div>

      </div>

      {/* Put Review Modal */}
      <PutReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Re-fetch approved reviews
          getApprovedReviews().then((approved) => {
            if (approved && approved.length > 0) {
              const mapped: Testimonial[] = approved.map(r => ({
                id: r.id,
                name: r.name,
                location: r.location,
                avatar: r.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.name)}&backgroundColor=059669&textColor=ffffff`,
                rating: r.rating || 5,
                tourName: r.tourName || "Northeast Tour",
                travelMode: r.travelMode || "Personal Private Tour",
                highlight: r.highlight || "Delightful travel experience with NE Dhanya!",
                review: r.review,
                date: new Date(r.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
              }));
              setItems(mapped);
            }
          });
        }}
      />

    </section>
  );
};
