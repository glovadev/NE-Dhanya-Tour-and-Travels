"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  MapPin, 
  Compass, 
  Package, 
  Car, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Star
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/firebase/authContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login page, render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Auth Guard
  if (!loading && !user) {
    if (typeof window !== "undefined") {
      router.push("/admin/login");
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        Checking admin authentication...
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Destinations", href: "/admin/destinations", icon: <Compass className="w-4 h-4" /> },
    { label: "Tourist Places", href: "/admin/places", icon: <MapPin className="w-4 h-4" /> },
    { label: "Tour Packages", href: "/admin/packages", icon: <Package className="w-4 h-4" /> },
    { label: "Vehicle Fleet", href: "/admin/vehicles", icon: <Car className="w-4 h-4" /> },
    { label: "Blog & SEO Guides", href: "/admin/blog", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Customer Enquiries", href: "/admin/enquiries", icon: <MessageSquare className="w-4 h-4" /> },
    { label: "Reviews & Ratings", href: "/admin/reviews", icon: <Star className="w-4 h-4" /> },
    { label: "Website Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-36 h-10">
            <Image 
              src="/images/logo-new.png" 
              alt="NE Dhanya" 
              fill 
              className="object-contain object-left" 
              unoptimized
            />
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            CMS
          </span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
        mobileNavOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="space-y-6">
          
          {/* Logo & Brand */}
          <div className="hidden lg:flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="relative w-40 h-12">
              <Image 
                src="/images/logo-new.png" 
                alt="NE Dhanya Tour and Travels" 
                fill 
                className="object-contain object-left" 
                unoptimized
              />
            </div>
          </div>

          {/* User Badge */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Console</span>
            </div>
            <div className="font-semibold text-white mt-1 truncate">
              {user?.email || "admin@nedhanyatours.com"}
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald-600 text-white font-bold shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-h-screen overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
