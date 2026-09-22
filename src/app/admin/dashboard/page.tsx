import React from "react";
import Link from "next/link";
import { 
  Package, 
  Compass, 
  MapPin, 
  BookOpen, 
  MessageSquare, 
  Car, 
  ArrowRight, 
  Plus, 
  Clock,
  CheckCircle2,
  Star
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { 
  getAllDestinations, 
  getAllTouristPlaces, 
  getAllPackages, 
  getAllVehicles, 
  getAllBlogPosts, 
  getAllEnquiries,
  getAllReviews,
  getSiteSettings
} from "@/lib/firebase/dataBridge";
import { createWhatsAppLink } from "@/lib/whatsapp";

export default async function AdminDashboardPage() {
  const [destinations, places, packages, vehicles, blogs, enquiries, reviews, settings] = await Promise.all([
    getAllDestinations(),
    getAllTouristPlaces(),
    getAllPackages(),
    getAllVehicles(),
    getAllBlogPosts(),
    getAllEnquiries(),
    getAllReviews(),
    getSiteSettings()
  ]);

  const publishedBlogs = blogs.filter(b => b.status === 'published').length;
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;

  const statCards = [
    { title: "Tour Packages", count: packages.length, icon: <Package className="w-5 h-5 text-emerald-400" />, href: "/admin/packages" },
    { title: "Tourist Places", count: places.length, icon: <MapPin className="w-5 h-5 text-amber-400" />, href: "/admin/places" },
    { title: "Vehicle Fleet", count: vehicles.length, icon: <Car className="w-5 h-5 text-purple-400" />, href: "/admin/vehicles" },
    { title: "Guest Reviews", count: reviews.length, icon: <Star className="w-5 h-5 text-amber-400" />, href: "/admin/reviews", badge: pendingReviews > 0 ? `${pendingReviews} Pending` : undefined },
    { title: "Published Blogs", count: publishedBlogs, icon: <BookOpen className="w-5 h-5 text-blue-400" />, href: "/admin/blog" },
    { title: "Total Enquiries", count: enquiries.length, icon: <MessageSquare className="w-5 h-5 text-rose-400" />, href: "/admin/enquiries", badge: newEnquiries > 0 ? `${newEnquiries} New` : undefined },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overview of website content, destinations, enquiries and conversion metrics.
          </p>
        </div>

        {/* Quick WhatsApp check */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-400">Configured WhatsApp:</span>
          <span className="font-mono text-emerald-400 font-semibold">+{settings.whatsappNumber}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all block group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              {card.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {card.badge}
                </span>
              )}
            </div>
            <div className="text-2xl font-extrabold text-white">
              {card.count}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>{card.title}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tour Packages</span>
          </Link>
          <Link
            href="/admin/places"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Tourist Places</span>
          </Link>
          <Link
            href="/admin/vehicles"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <Car className="w-4 h-4 text-purple-400" />
            <span>Vehicle Fleet</span>
          </Link>
          <Link
            href="/admin/destinations"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Destinations</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-rose-400" />
            <span>Customer Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Recent Enquiries & Recent Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Customer Enquiries */}
        <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-heading">
              Recent Customer Enquiries
            </h2>
            <Link href="/admin/enquiries" className="text-xs text-emerald-400 hover:underline">
              View all &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 5).map((enq) => {
              const waUrl = createWhatsAppLink(
                enq.phone,
                `Hello ${enq.name}, thank you for contacting NE Dhanya Tour and Travels regarding your ${enq.destination} trip.`
              );

              return (
                <div key={enq.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{enq.name}</span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                        {enq.destination}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>📱 {enq.phone}</span>
                      <span>👥 {enq.travellers} Pax</span>
                      <span>🚗 {enq.travelType}</span>
                    </div>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-heading">
              Published SEO Guides & Articles
            </h2>
            <Link href="/admin/blog" className="text-xs text-emerald-400 hover:underline">
              View all &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {blogs.slice(0, 5).map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-white text-sm line-clamp-1">
                    {b.title}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="text-emerald-400">{b.category}</span>
                    <span>•</span>
                    <span>{b.readingTime}</span>
                  </div>
                </div>

                <Link
                  href={`/blog/${b.slug}`}
                  target="_blank"
                  className="shrink-0 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
