import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Award, 
  CheckCircle2 
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SiteSettings } from "@/types";
import { createWhatsAppLink, getGeneralEnquiryMessage } from "@/lib/whatsapp";

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const whatsappUrl = createWhatsAppLink(settings.whatsappNumber, getGeneralEnquiryMessage());

  const states = [
    { name: "Meghalaya Tours", slug: "meghalaya" },
    { name: "Assam Wildlife & Culture", slug: "assam" },
    { name: "Arunachal Pradesh & Tawang", slug: "arunachal-pradesh" },
    { name: "Sikkim & Gangtok", slug: "sikkim" },
    { name: "Nagaland & Dzukou", slug: "nagaland" },
    { name: "Bhutan International Tours", slug: "bhutan" },
    { name: "Mizoram Blue Mountains", slug: "mizoram" },
    { name: "Tripura Heritage", slug: "tripura" },
  ];

  const services = [
    { name: "Personal / Private Tours", url: "/tour-packages" },
    { name: "Budget Sharing Tours", url: "/tour-packages" },
    { name: "Northeast Car Rental & Taxi", url: "/car-rental" },
    { name: "Hotel & Homestay Booking", url: "/hotel-booking" },
    { name: "Guwahati Airport Pickup & Transfers", url: "/car-rental" },
    { name: "Tawang & North Sikkim 4x4 Cabs", url: "/car-rental" },
    { name: "Hornbill Festival Tours", url: "/destinations/nagaland" },
    { name: "Kaziranga Elephant & Jeep Safari", url: "/destinations/assam/kaziranga-national-park" }
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-forest-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Local Northeast Experts</h4>
              <p className="text-xs text-slate-400 mt-0.5">Deep regional ground knowledge & verified mountain routes.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Personal & Sharing Travel</h4>
              <p className="text-xs text-slate-400 mt-0.5">Choose private luxury vehicles or budget sharing tours.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">All-in-One Solution</h4>
              <p className="text-xs text-slate-400 mt-0.5">Tour packages + Clean vehicles + Handpicked stays.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
              <WhatsAppIcon className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Fast WhatsApp Booking</h4>
              <p className="text-xs text-slate-400 mt-0.5">Plan, customize, and confirm trips directly on WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative w-48 h-14 bg-white/5 rounded-lg p-2">
                <Image 
                  src="https://res.cloudinary.com/bpi3s64e/image/upload/v1790142056/ne_dhaniya_tours/logo-new.png" 
                  alt="NE Dhanya Tour and Travels" 
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Explore Northeast India & Bhutan with comfort, trust, and local authenticity. Dedicated private cabs, group buses, scenic packages, and reliable hotel bookings.
            </p>
            
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-white transition-all shadow hover:shadow-emerald-500/20"
              >
                <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
                <span>Chat on WhatsApp (24/7 Support)</span>
              </a>
            </div>
          </div>

          {/* Destinations Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Northeast Destinations
            </h3>
            <ul className="space-y-2 text-sm">
              {states.map((s) => (
                <li key={s.slug}>
                  <Link 
                    href={`/destinations/${s.slug}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Services & Travel
            </h3>
            <ul className="space-y-2 text-sm">
              {services.map((srv, idx) => (
                <li key={idx}>
                  <Link 
                    href={srv.url}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {srv.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Contact NE Dhanya
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <div className="flex flex-col gap-1">
                  <a href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                    {settings.phoneNumber}
                  </a>
                  {settings.secondaryPhoneNumber && (
                    <a href={`tel:${settings.secondaryPhoneNumber.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                      {settings.secondaryPhoneNumber}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] fill-current shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-500">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{settings.businessHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about-us" className="hover:text-slate-400">About Us</Link>
            <Link href="/contact" className="hover:text-slate-400">Contact</Link>
            <Link href="/blog" className="hover:text-slate-400">Travel Blog</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-400">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
