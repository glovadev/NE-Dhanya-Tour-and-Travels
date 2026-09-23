"use client";

import React, { useState, useEffect } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { submitEnquiry, getSiteSettings } from "@/lib/firebase/dataBridge";
import { SiteSettings } from "@/types";

export default function ContactPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSiteSettings);
  }, []);

  const whatsappNumber = siteSettings?.whatsappNumber || "919387843282";
  const phoneNumber = siteSettings?.phoneNumber || "+91 93878 43282";
  const secondaryPhoneNumber = siteSettings?.secondaryPhoneNumber || "+91 98640 66495";
  const email = siteSettings?.email || "munin.ghy123@gmail.com";
  const address = siteSettings?.address || "Guwahati, Assam, India - 781001 (Gateway to Northeast India)";
  const businessHours = siteSettings?.businessHours || "Monday - Sunday: 7:00 AM - 10:00 PM (WhatsApp Support 24/7)";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("Meghalaya");
  const [travelType, setTravelType] = useState<"personal" | "sharing" | "not-sure">("personal");
  const [travelDate, setTravelDate] = useState("");
  const [travellers, setTravellers] = useState(2);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappUrl = createWhatsAppLink(
    whatsappNumber,
    "Hello NE Dhanya Tour and Travels, I would like to contact your team regarding a trip to Northeast India."
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and contact number.");
      return;
    }

    setSubmitting(true);
    try {
      await submitEnquiry({
        name,
        phone,
        destination,
        travelDate: travelDate || "Flexible",
        travellers,
        travelType,
        message,
        sourcePage: "/contact",
      });

      setSubmitted(true);

      const waMsg = [
        `Hello NE Dhanya Tour and Travels, I have submitted an enquiry:`,
        `👤 Name: ${name}`,
        `📱 Contact: ${phone}`,
        `📍 Destination: ${destination}`,
        `🚗 Travel Mode: ${travelType}`,
        `👥 Travellers: ${travellers}`,
        travelDate ? `📅 Date: ${travelDate}` : null,
        message ? `💬 Message: ${message}` : null,
      ].filter(Boolean).join("\n");

      const waUrl = createWhatsAppLink(whatsappNumber, waMsg);

      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Error submitting. Please contact directly on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-nature-bg min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Contact Us", url: "/contact" }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Reach Out Anytime
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 font-heading">
            Contact NE Dhanya Tour and Travels
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Planning a trip, need a vehicle quote, or have questions about permits? Our local travel team in Guwahati is always ready to assist you.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Direct Contact Channels
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
                <WhatsAppIcon className="w-5 h-5 text-[#25D366] fill-current shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">WhatsApp (Fastest Response)</strong>
                  <span>24/7 Trip Consultations & Quotes</span>
                  <div className="mt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <span>Chat on WhatsApp &rarr;</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Phone Support</strong>
                  <div className="flex flex-col gap-1 mt-1">
                    <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className="text-forest-700 font-semibold hover:underline">
                      {phoneNumber}
                    </a>
                    <a href={`tel:${secondaryPhoneNumber.replace(/\s+/g, '')}`} className="text-forest-700 font-semibold hover:underline">
                      {secondaryPhoneNumber}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Email Enquiries</strong>
                  <a href={`mailto:${email}`} className="text-forest-700 font-semibold hover:underline mt-1 block">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Registered Hub</strong>
                  <span>{address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Operating Hours</strong>
                  <span>{businessHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Enquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Thank You!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your enquiry has been forwarded. Opening WhatsApp now to connect you with our travel coordinator...
                </p>
              </div>
            ) : (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Instant Travel Query
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
                  Send Your Travel Enquiry
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
                  Fill in your travel preferences and get a prompt response on WhatsApp.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priyanshu Das"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Assam">Assam</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Multi-State Tour">Multi-State Tour</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Mode</label>
                      <select
                        value={travelType}
                        onChange={(e) => setTravelType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="personal">Personal / Private Cab</option>
                        <option value="sharing">Sharing Tour</option>
                        <option value="not-sure">Not Sure / Suggest</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Travellers</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={travellers}
                        onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tentative Travel Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Trip Details & Questions</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mention any specific places, hotel preferences, or pickup requirements..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-white fill-current" />
                    <span>{submitting ? "Sending..." : "Submit & Connect on WhatsApp"}</span>
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    We reply promptly within minutes during business hours.
                  </p>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
