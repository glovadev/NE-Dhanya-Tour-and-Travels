"use client";

import React, { useState } from "react";
import { 
  X, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Compass, 
  MessageSquare,
  User
} from "lucide-react";
import { submitReview } from "@/lib/firebase/dataBridge";

interface PutReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PutReviewModal: React.FC<PutReviewModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [tourName, setTourName] = useState("Meghalaya Scenic Escape (6D/5N)");
  const [customTour, setCustomTour] = useState("");
  const [travelMode, setTravelMode] = useState("Personal Private Tour");
  const [highlight, setHighlight] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const popularTours = [
    "Meghalaya Scenic Escape (6D/5N)",
    "Guwahati to Tawang Circuit (8D/7N)",
    "Kaziranga Wildlife & Tea Trail (5D/4N)",
    "Sikkim Himalayan Explorer (7D/6N)",
    "Bhutan Cultural Tour (7D/6N)",
    "Guwahati Outstation Taxi & Sightseeing",
    "Other Destination / Custom Tour"
  ];

  const ratingDescriptions = [
    "",
    "1 - Poor experience",
    "2 - Fair",
    "3 - Good experience",
    "4 - Very Good",
    "5 - Outstanding & Highly Recommended!"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !location.trim() || !review.trim()) {
      setError("Please fill in all required fields (Name, Location, and Review).");
      return;
    }

    setLoading(true);

    try {
      const finalTourName = tourName === "Other Destination / Custom Tour" 
        ? (customTour.trim() || "Northeast Tour") 
        : tourName;

      await submitReview({
        name: name.trim(),
        location: location.trim(),
        rating,
        tourName: finalTourName,
        travelMode,
        highlight: highlight.trim() || undefined,
        review: review.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=059669&textColor=ffffff`
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Submit review error", err);
      setError("Failed to submit review. Please try again or message us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setLocation("");
    setHighlight("");
    setReview("");
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold font-heading">Thank You, {name}!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your review has been submitted successfully. To maintain authenticity and quality, our admin team verifies all reviews before they appear live on the website.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all"
              >
                Close & Return to Page
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guest Testimonial</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading">
                Share Your Travel Experience
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell fellow travelers about your journey with NE Dhanya Tour and Travels.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Rating Stars */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Overall Rating <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-600 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star 
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating || rating) >= star 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-slate-700"
                      }`} 
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-amber-400 ml-2">
                  {ratingDescriptions[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* Name and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sen & Family"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your City / State <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kolkata, West Bengal"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Tour Taken & Travel Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tour Package / Circuit
                </label>
                <select
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {popularTours.map((t) => (
                    <option key={t} value={t} className="bg-slate-900 text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Travel Mode
                </label>
                <select
                  value={travelMode}
                  onChange={(e) => setTravelMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Personal Private Tour">Personal Private Tour (Dedicated Cab)</option>
                  <option value="Sharing Tour">Sharing Tour (Budget / Traveler)</option>
                  <option value="Outstation Car Rental">Outstation Car Rental & Taxi</option>
                  <option value="Family Holiday">Family Holiday Trip</option>
                </select>
              </div>
            </div>

            {tourName === "Other Destination / Custom Tour" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom Tour / Places Visited
                </label>
                <input
                  type="text"
                  placeholder="e.g. Majuli River Island & Kaziranga Safari"
                  value={customTour}
                  onChange={(e) => setCustomTour(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Highlight / Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Review Headline / Highlight
              </label>
              <input
                type="text"
                placeholder="e.g. Flawless Innova Crysta & polite driver Bimal Da!"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Detailed Review */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Review / Experience <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write your honest feedback about the vehicles, driver, hotels, timings, or customer service..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
