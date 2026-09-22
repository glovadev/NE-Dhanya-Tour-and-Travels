"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, 
  X, 
  Phone, 
  Compass, 
  Car, 
  Building2, 
  BookOpen, 
  ShieldCheck, 
  ChevronDown 
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SiteSettings } from "@/types";
import { createWhatsAppLink, getGeneralEnquiryMessage } from "@/lib/whatsapp";

interface HeaderProps {
  settings: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = createWhatsAppLink(
    settings.whatsappNumber, 
    getGeneralEnquiryMessage()
  );

  const states = [
    { name: "Meghalaya", slug: "meghalaya" },
    { name: "Assam", slug: "assam" },
    { name: "Arunachal Pradesh", slug: "arunachal-pradesh" },
    { name: "Sikkim", slug: "sikkim" },
    { name: "Nagaland", slug: "nagaland" },
    { name: "Bhutan", slug: "bhutan" },
    { name: "Mizoram", slug: "mizoram" },
    { name: "Tripura", slug: "tripura" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md py-2" 
          : "bg-gradient-to-b from-black/70 via-black/40 to-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-40 sm:w-48 h-12 sm:h-14 transition-transform group-hover:scale-[1.02]">
            <Image 
              src="/images/logo-new.png" 
              alt="NE Dhanya Tour and Travels Logo" 
              fill
              className="object-contain object-left"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link 
            href="/" 
            className={`font-medium text-sm tracking-wide transition-colors ${
              isScrolled ? "text-slate-700 hover:text-forest-700" : "text-white/95 hover:text-emerald-400"
            }`}
          >
            Home
          </Link>

          {/* Destinations Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setDestDropdownOpen(true)}
            onMouseLeave={() => setDestDropdownOpen(false)}
          >
            <Link 
              href="/destinations" 
              className={`flex items-center gap-1 font-medium text-sm tracking-wide transition-colors ${
                isScrolled ? "text-slate-700 hover:text-forest-700" : "text-white/95 hover:text-emerald-400"
              }`}
            >
              Destinations
              <ChevronDown className="w-4 h-4 opacity-80" />
            </Link>

            {destDropdownOpen && (
              <div className="absolute top-full -left-4 w-60 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 py-1">
                  Northeast States & Bhutan
                </div>
                {states.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/destinations/${s.slug}`}
                    onClick={() => setDestDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800 rounded-lg transition-colors"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Explore &rarr;</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link 
            href="/tour-packages" 
            className={`font-medium text-sm tracking-wide transition-colors ${
              isScrolled ? "text-slate-700 hover:text-forest-700" : "text-white/95 hover:text-emerald-400"
            }`}
          >
            Tour Packages
          </Link>

          <Link 
            href="/car-rental" 
            className={`font-medium text-sm tracking-wide transition-colors ${
              isScrolled ? "text-slate-700 hover:text-forest-700" : "text-white/95 hover:text-emerald-400"
            }`}
          >
            Car Rental
          </Link>

          <Link 
            href="/hotel-booking" 
            className={`font-medium text-sm tracking-wide transition-colors ${
              isScrolled ? "text-slate-700 hover:text-forest-700" : "text-white/95 hover:text-emerald-400"
            }`}
          >
            Hotel Booking
          </Link>

          <Link 
            href="/blog" 
            className={`font-medium text-sm tracking-wide transition-colors ${
              isScrolled ? "text-slate-700 hover:text-forest-700" : "text-white/95 hover:text-emerald-400"
            }`}
          >
            Travel Guide
          </Link>

          <Link 
            href="/about-us" 
            className={`font-medium text-sm tracking-wide transition-colors ${
              isScrolled ? "text-slate-700 hover:text-forest-700" : "text-white/95 hover:text-emerald-400"
            }`}
          >
            About Us
          </Link>

          <Link 
            href="/contact" 
            className={`font-medium text-sm tracking-wide transition-colors ${
              isScrolled ? "text-slate-700 hover:text-forest-700" : "text-white/95 hover:text-emerald-400"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-all ${
              isScrolled 
                ? "border-slate-200 text-slate-700 hover:bg-slate-50" 
                : "border-white/30 text-white hover:bg-white/10"
            }`}
            title={`Call ${settings.phoneNumber}`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>{settings.phoneNumber}</span>
          </a>

          {settings.secondaryPhoneNumber && (
            <a
              href={`tel:${settings.secondaryPhoneNumber.replace(/\s+/g, '')}`}
              className={`hidden xl:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-all ${
                isScrolled 
                  ? "border-slate-200 text-slate-700 hover:bg-slate-50" 
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
              title={`Call ${settings.secondaryPhoneNumber}`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.secondaryPhoneNumber}</span>
            </a>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isScrolled ? "text-slate-800" : "text-white"
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-2xl px-6 py-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-4 border-b border-slate-100">
            <a
              href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              Call Now
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-forest-700 text-white rounded-xl text-xs font-semibold shadow"
            >
              <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
              WhatsApp Us
            </a>
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Home
            </Link>
            
            <div className="py-1">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Northeast Destinations
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1 pl-2">
                {states.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/destinations/${s.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-1.5 text-sm text-slate-600 hover:text-forest-700 hover:bg-forest-50 rounded"
                  >
                    • {s.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/tour-packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Tour Packages
            </Link>

            <Link
              href="/car-rental"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Car Rental & Taxis
            </Link>

            <Link
              href="/hotel-booking"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Hotel Booking
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Travel Guide & Articles
            </Link>

            <Link
              href="/about-us"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
