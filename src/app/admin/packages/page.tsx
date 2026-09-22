"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  Clock, 
  MapPin, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Save, 
  Calendar, 
  Sparkles,
  ListPlus,
  AlertTriangle
} from "lucide-react";
import { 
  getAllPackages, 
  savePackage, 
  deletePackage, 
  getAllDestinations 
} from "@/lib/firebase/dataBridge";
import { TourPackage, Destination, TravelMode, TourType, ItineraryDay } from "@/types";
import CloudinaryUpload, { CloudinaryGalleryUpload } from "@/components/admin/CloudinaryUpload";

const ALL_TOUR_TYPES: { id: TourType; label: string }[] = [
  { id: "family", label: "Family" },
  { id: "honeymoon", label: "Honeymoon" },
  { id: "adventure", label: "Adventure" },
  { id: "wildlife", label: "Wildlife" },
  { id: "group", label: "Group" },
  { id: "budget", label: "Budget" },
  { id: "luxury", label: "Luxury" },
];

const emptyPackage: Omit<TourPackage, "id"> & { id?: string } = {
  name: "",
  slug: "",
  destinationSlug: "meghalaya",
  destinationName: "Meghalaya",
  duration: "5 Days / 4 Nights",
  travelMode: "both",
  tourType: ["family"],
  shortDescription: "",
  description: "",
  heroImage: "",
  gallery: [],
  highlights: [""],
  itinerary: [
    {
      day: 1,
      title: "Guwahati Arrival & Transfer to Shillong",
      description: "Arrival at Guwahati Airport/Railway Station, visit Umiam Lake and proceed to Shillong.",
      nightStay: "Shillong",
      mealsIncluded: "Dinner",
    },
    {
      day: 2,
      title: "Cherrapunjee Sightseeing & Waterfalls",
      description: "Explore Nohkalikai Falls, Seven Sisters Falls, Mawsmai Cave and eco park.",
      nightStay: "Cherrapunjee / Shillong",
      mealsIncluded: "Breakfast & Dinner",
    }
  ],
  inclusions: [
    "Private / Dedicated sanitized vehicle with experienced hill driver",
    "Hotel accommodation with breakfast and dinner",
    "All toll taxes, parking fees, and driver allowances",
    "Fuel charges and interstate permits"
  ],
  exclusions: [
    "Airfare or train fare",
    "Entry fees to monuments and adventure activities",
    "Personal expenses and tips",
    "GST 5%"
  ],
  vehicleOptions: ["Innova Crysta", "Swift Dzire", "Tempo Traveller"],
  hotelOptions: ["3 Star Deluxe", "4 Star Premium", "Luxury Resort"],
  faqs: [],
  seoTitle: "",
  seoDescription: "",
  featured: false,
  status: "published",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDest, setSelectedDest] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [formData, setFormData] = useState<any>(emptyPackage);
  const [activeTab, setActiveTab] = useState<"basic" | "itinerary" | "features" | "media" | "seo">("basic");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    const [pkgs, dests] = await Promise.all([getAllPackages(), getAllDestinations()]);
    setPackages(pkgs);
    setDestinations(dests);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
    const handleUpdate = () => fetchPackages();
    window.addEventListener("ne_dhanya_packages_updated", handleUpdate);
    return () => window.removeEventListener("ne_dhanya_packages_updated", handleUpdate);
  }, []);

  const openCreateModal = () => {
    setEditingPackage(null);
    setFormData({
      ...emptyPackage,
      id: `pkg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setActiveTab("basic");
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setFormData({ ...pkg });
    setActiveTab("basic");
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev: any) => ({
      ...prev,
      name,
      slug: prev.slug && editingPackage ? prev.slug : slug,
      seoTitle: prev.seoTitle ? prev.seoTitle : `${name} Tour Package | NE Dhaniya Tours`,
    }));
  };

  const handleDestinationChange = (destSlug: string) => {
    const found = destinations.find(d => d.slug === destSlug);
    setFormData((prev: any) => ({
      ...prev,
      destinationSlug: destSlug,
      destinationName: found ? found.name : destSlug.charAt(0).toUpperCase() + destSlug.slice(1),
    }));
  };

  const toggleTourType = (type: TourType) => {
    setFormData((prev: any) => {
      const current = prev.tourType || [];
      if (current.includes(type)) {
        return { ...prev, tourType: current.filter((t: TourType) => t !== type) };
      } else {
        return { ...prev, tourType: [...current, type] };
      }
    });
  };

  // Itinerary day handlers
  const handleAddDay = () => {
    setFormData((prev: any) => {
      const nextDayNum = (prev.itinerary?.length || 0) + 1;
      return {
        ...prev,
        itinerary: [
          ...(prev.itinerary || []),
          {
            day: nextDayNum,
            title: `Day ${nextDayNum} Sightseeing`,
            description: "",
            nightStay: "",
            mealsIncluded: "Breakfast",
          }
        ]
      };
    });
  };

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    setFormData((prev: any) => {
      const updated = [...(prev.itinerary || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const handleRemoveDay = (index: number) => {
    setFormData((prev: any) => {
      const updated = prev.itinerary.filter((_: any, i: number) => i !== index);
      // Re-number days
      const renumbered = updated.map((d: ItineraryDay, idx: number) => ({ ...d, day: idx + 1 }));
      return { ...prev, itinerary: renumbered };
    });
  };

  // Highlights handlers
  const handleHighlightsText = (val: string) => {
    const lines = val.split("\n").filter(l => l.trim().length > 0);
    setFormData((prev: any) => ({ ...prev, highlights: lines }));
  };

  const handleInclusionsText = (val: string) => {
    const lines = val.split("\n").filter(l => l.trim().length > 0);
    setFormData((prev: any) => ({ ...prev, inclusions: lines }));
  };

  const handleExclusionsText = (val: string) => {
    const lines = val.split("\n").filter(l => l.trim().length > 0);
    setFormData((prev: any) => ({ ...prev, exclusions: lines }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatusMessage({ type: "error", text: "Please enter a Package Name." });
      setActiveTab("basic");
      return;
    }
    if (!formData.slug.trim()) {
      setStatusMessage({ type: "error", text: "Package Slug is required." });
      setActiveTab("basic");
      return;
    }
    if (!formData.heroImage.trim()) {
      setStatusMessage({ type: "error", text: "Please upload or provide a Hero Image." });
      setActiveTab("media");
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const payload: TourPackage = {
        ...formData,
        id: formData.id || `pkg-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };

      await savePackage(payload);
      await fetchPackages();
      setStatusMessage({ type: "success", text: "Tour Package saved successfully!" });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 800);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err?.message || "Failed to save package." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pkg: TourPackage) => {
    try {
      await deletePackage(pkg.slug || pkg.id);
      await fetchPackages();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Failed to delete package:", err);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.destinationName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.slug.toLowerCase().includes(search.toLowerCase());
    const matchesDest = selectedDest === "all" || pkg.destinationSlug.toLowerCase() === selectedDest.toLowerCase();
    return matchesSearch && matchesDest;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">
            Tour Packages Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, edit, and organize tour itineraries, personal & sharing tour modes, and Cloudinary media.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tour Package</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tour packages by title, state, or duration..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedDest}
          onChange={(e) => setSelectedDest(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Destinations ({packages.length})</option>
          {destinations.map(d => (
            <option key={d.id || d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Grid of Packages */}
      {loading ? (
        <div className="text-slate-400 text-sm py-16 text-center">Loading tour packages...</div>
      ) : filteredPackages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Tour Packages Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or click "Add Tour Package" to create a new one.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Create Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id || pkg.slug}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors group"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-900">
                  <Image
                    src={pkg.heroImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"}
                    alt={pkg.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                    <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow border border-emerald-500/20">
                      {pkg.travelMode === "both" ? "Personal & Sharing" : pkg.travelMode}
                    </span>
                    {pkg.featured && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {pkg.duration}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{pkg.name}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <span className="text-emerald-400">📍 {pkg.destinationName}</span>
                    <span>•</span>
                    <span>{pkg.itinerary?.length || 0} Days Plan</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {pkg.shortDescription || pkg.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit</span>
                  </button>

                  <Link
                    href={`/tour-packages/${pkg.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-900"
                    title="View public page"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    pkg.status === "published" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" : "bg-slate-800 text-slate-400"
                  }`}>
                    {pkg.status}
                  </span>

                  <button
                    onClick={() => setDeleteConfirmId(pkg.slug || pkg.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                    title="Delete package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/50 border border-rose-800/50 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Tour Package?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This will remove this package from public booking widgets and itineraries.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = packages.find(p => p.slug === deleteConfirmId || p.id === deleteConfirmId);
                  if (target) handleDelete(target);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingPackage ? `Edit: ${editingPackage.name}` : "Create New Tour Package"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Upload photos directly to Cloudinary and customize itineraries
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex border-b border-slate-800 px-4 sm:px-5 bg-slate-950 text-xs overflow-x-auto gap-2 py-2">
              {[
                { id: "basic", label: "1. Basic Details" },
                { id: "media", label: "2. Cloudinary Media" },
                { id: "itinerary", label: "3. Daily Itinerary" },
                { id: "features", label: "4. Highlights & Inclusions" },
                { id: "seo", label: "5. SEO & Status" },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {statusMessage && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  statusMessage.type === "success" 
                    ? "bg-emerald-950/80 border border-emerald-800/60 text-emerald-300"
                    : "bg-rose-950/80 border border-rose-800/60 text-rose-300"
                }`}>
                  {statusMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* TAB 1: BASIC DETAILS */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Package Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. 5 Days Enchanting Meghalaya Escapade"
                        required
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. meghalaya-escapade-5-days"
                        required
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Destination State *
                      </label>
                      <select
                        value={formData.destinationSlug}
                        onChange={(e) => handleDestinationChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                      >
                        {destinations.map(d => (
                          <option key={d.slug} value={d.slug}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Duration *
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g. 6 Days / 5 Nights"
                        required
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Travel Mode Support *
                      </label>
                      <select
                        value={formData.travelMode}
                        onChange={(e) => setFormData({ ...formData, travelMode: e.target.value as TravelMode })}
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="both">Personal & Sharing (Both Available)</option>
                        <option value="personal">Personal / Private Only</option>
                        <option value="sharing">Sharing Tour Group Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Tour Types Checkboxes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Tour Type Tags (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_TOUR_TYPES.map(type => {
                        const isSelected = (formData.tourType || []).includes(type.id);
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => toggleTourType(type.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                              isSelected
                                ? "bg-emerald-600 border-emerald-500 text-white"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}{type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Short Tagline / Teaser
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="e.g. Experience living root bridges, crystal clear rivers of Dawki, and high misty peaks."
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Detailed Tour Overview Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Comprehensive overview of the tour experience..."
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CLOUDINARY MEDIA */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
                    <CloudinaryUpload
                      label="Package Hero Cover Image (Stored in Cloudinary)"
                      value={formData.heroImage}
                      onChange={(url) => setFormData({ ...formData, heroImage: url })}
                      folder="ne_dhaniya_tours/packages"
                      hint="High-resolution landscape photo for package banners"
                    />
                  </div>

                  <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
                    <CloudinaryGalleryUpload
                      label="Tour Photo Gallery"
                      values={formData.gallery || []}
                      onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                      folder="ne_dhaniya_tours/packages/gallery"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: DAILY ITINERARY */}
              {activeTab === "itinerary" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Day-by-Day Itinerary Plan ({formData.itinerary?.length || 0} Days)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Customize daily schedules, night stays, and meal plans.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Day</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.itinerary || []).map((day: ItineraryDay, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Day {day.day}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(index)}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Day
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              Day Title
                            </label>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => handleUpdateDay(index, "title", e.target.value)}
                              placeholder="e.g. Guwahati to Shillong via Umiam Lake"
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                Night Stay
                              </label>
                              <input
                                type="text"
                                value={day.nightStay || ""}
                                onChange={(e) => handleUpdateDay(index, "nightStay", e.target.value)}
                                placeholder="e.g. Shillong"
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                Meals
                              </label>
                              <input
                                type="text"
                                value={day.mealsIncluded || ""}
                                onChange={(e) => handleUpdateDay(index, "mealsIncluded", e.target.value)}
                                placeholder="Breakfast & Dinner"
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Day Activities & Sightseeing Details
                          </label>
                          <textarea
                            rows={2}
                            value={day.description}
                            onChange={(e) => handleUpdateDay(index, "description", e.target.value)}
                            placeholder="Detailed description of what the guests will visit on this day..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: HIGHLIGHTS & INCLUSIONS */}
              {activeTab === "features" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Key Highlights (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={(formData.highlights || []).join("\n")}
                      onChange={(e) => handleHighlightsText(e.target.value)}
                      placeholder="Boat ride on crystal clear Umngot River&#10;Living Root Bridge trekking in Nohwet&#10;Seven Sisters & Nohkalikai falls view"
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tour Inclusions (One per line)
                      </label>
                      <textarea
                        rows={4}
                        value={(formData.inclusions || []).join("\n")}
                        onChange={(e) => handleInclusionsText(e.target.value)}
                        placeholder="Private Sanitized Cab&#10;Hotel Accommodations with Breakfast&#10;Toll, Fuel & Driver allowances"
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tour Exclusions (One per line)
                      </label>
                      <textarea
                        rows={4}
                        value={(formData.exclusions || []).join("\n")}
                        onChange={(e) => handleExclusionsText(e.target.value)}
                        placeholder="Airfare / Train fare&#10;Monuments Entry Fees&#10;Personal Expenses"
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SEO & SETTINGS */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Publishing Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="published">Published (Visible on site)</option>
                        <option value="draft">Draft (Hidden from public)</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured || false}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-800"
                        />
                        <span className="text-xs font-semibold text-slate-300">
                          Feature on Homepage Top Tours
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle || ""}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="e.g. Meghalaya 5 Days Tour Package | Personal & Sharing Taxi | NE Dhaniya Tours"
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seoDescription || ""}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="Book 5 days tour in Meghalaya covering Shillong, Cherrapunjee, Dawki. Private cabs and sharing options available."
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : editingPackage ? "Update Tour Package" : "Publish Tour Package"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
