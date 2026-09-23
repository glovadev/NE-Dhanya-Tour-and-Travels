"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Save, 
  AlertTriangle,
  Compass
} from "lucide-react";
import { 
  getAllTouristPlaces, 
  saveTouristPlace, 
  deleteTouristPlace, 
  getAllDestinations 
} from "@/lib/firebase/dataBridge";
import { TouristPlace, Destination } from "@/types";
import CloudinaryUpload, { CloudinaryGalleryUpload } from "@/components/admin/CloudinaryUpload";

const emptyPlace: Omit<TouristPlace, "id"> & { id?: string } = {
  name: "",
  slug: "",
  destinationSlug: "meghalaya",
  destinationName: "Meghalaya",
  shortDescription: "",
  description: "",
  heroImage: "",
  gallery: [],
  topThingsToDo: ["Sightseeing", "Photography", "Local Culture"],
  bestTimeToVisit: "October to May",
  howToReach: {
    byAir: "Nearest airport is Guwahati Airport (GAU).",
    byRail: "Nearest railway station is Guwahati Railway Station (GHY).",
    byRoad: "Accessible via private cabs and shared taxis from Guwahati."
  },
  travelTips: [
    "Carry light woolens in evening",
    "Keep umbrella or raincoat handy in monsoon",
    "Respect local community rules"
  ],
  faqs: [],
  relatedPackages: [],
  seoTitle: "",
  seoDescription: "",
  status: "published",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<TouristPlace | null>(null);
  const [formData, setFormData] = useState<any>(emptyPlace);
  const [activeTab, setActiveTab] = useState<"basic" | "media" | "guide" | "seo">("basic");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPlaces = async () => {
    setLoading(true);
    const [pList, dList] = await Promise.all([getAllTouristPlaces(), getAllDestinations()]);
    setPlaces(pList);
    setDestinations(dList);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaces();
    const handleUpdate = () => fetchPlaces();
    window.addEventListener("ne_dhanya_places_updated", handleUpdate);
    return () => window.removeEventListener("ne_dhanya_places_updated", handleUpdate);
  }, []);

  const openCreateModal = () => {
    setEditingPlace(null);
    setFormData({
      ...emptyPlace,
      id: `place-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setActiveTab("basic");
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (place: TouristPlace) => {
    setEditingPlace(place);
    setFormData({ ...place });
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
      slug: prev.slug && editingPlace ? prev.slug : slug,
      seoTitle: prev.seoTitle ? prev.seoTitle : `${name} Travel Guide | Taxi & Tour Guide | NE Dhaniya Tours`,
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

  const handleThingsToDoText = (val: string) => {
    const lines = val.split("\n").filter(l => l.trim().length > 0);
    setFormData((prev: any) => ({ ...prev, topThingsToDo: lines }));
  };

  const handleTravelTipsText = (val: string) => {
    const lines = val.split("\n").filter(l => l.trim().length > 0);
    setFormData((prev: any) => ({ ...prev, travelTips: lines }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatusMessage({ type: "error", text: "Please enter Place Name." });
      setActiveTab("basic");
      return;
    }
    if (!formData.slug.trim()) {
      setStatusMessage({ type: "error", text: "Place Slug is required." });
      setActiveTab("basic");
      return;
    }
    if (!formData.heroImage.trim()) {
      setStatusMessage({ type: "error", text: "Please upload a Hero Image to Cloudinary." });
      setActiveTab("media");
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const payload: TouristPlace = {
        ...formData,
        id: formData.id || `${formData.destinationSlug}_${formData.slug}`,
        updatedAt: new Date().toISOString(),
      };

      const ok = await saveTouristPlace(payload);
      if (!ok) {
        throw new Error("Failed to save tourist place to database. Please check connection and try again.");
      }
      await fetchPlaces();
      setStatusMessage({ type: "success", text: "Tourist Place saved successfully!" });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 800);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err?.message || "Failed to save place." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (place: TouristPlace) => {
    try {
      const ok = await deleteTouristPlace(place.id || `${place.destinationSlug}_${place.slug}`);
      if (!ok) {
        alert("Failed to delete place from database. Please try again.");
        return;
      }
      await fetchPlaces();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Failed to delete place:", err);
    }
  };

  const filteredPlaces = places.filter(place => {
    const matchesSearch = 
      place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.destinationName.toLowerCase().includes(search.toLowerCase()) ||
      place.slug.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === "all" || place.destinationSlug.toLowerCase() === selectedState.toLowerCase();
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">
            Tourist Places CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage sightseeing destinations, taxi hubs, Cloudinary image galleries, and travel guide content.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tourist Place</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tourist spots by name or state..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All States ({places.length} Places)</option>
          {destinations.map(d => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-slate-400 text-sm py-16 text-center">Loading tourist places...</div>
      ) : filteredPlaces.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Tourist Places Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or add a new tourist place.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Place
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id || `${place.destinationSlug}_${place.slug}`}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors group"
            >
              <div className="space-y-3">
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900">
                  <Image
                    src={place.heroImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"}
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow border border-emerald-500/20">
                    📍 {place.destinationName}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{place.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {place.shortDescription || place.description}
                  </p>
                </div>

                {place.topThingsToDo && place.topThingsToDo.length > 0 && (
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Top Sights / Activities:</span>
                    <div className="line-clamp-2 text-emerald-400/90">
                      {place.topThingsToDo.join(" • ")}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(place)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit</span>
                  </button>

                  <Link
                    href={`/destinations/${place.destinationSlug}/${place.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-900"
                    title="View public destination page"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    place.status === "published" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" : "bg-slate-800 text-slate-400"
                  }`}>
                    {place.status}
                  </span>

                  <button
                    onClick={() => setDeleteConfirmId(place.id || `${place.destinationSlug}_${place.slug}`)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                    title="Delete place"
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
              <h3 className="text-base font-bold text-white">Delete Tourist Place?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This will remove this place and its travel guide from the public site.
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
                  const target = places.find(p => p.id === deleteConfirmId || `${p.destinationSlug}_${p.slug}` === deleteConfirmId);
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

      {/* Main Add / Edit Place Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingPlace ? `Edit: ${editingPlace.name}` : "Add New Tourist Place"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Sightseeing guide, how-to-reach, and Cloudinary media uploads
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

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 px-4 sm:px-5 bg-slate-950 text-xs overflow-x-auto gap-2 py-2">
              {[
                { id: "basic", label: "1. Basic Details" },
                { id: "media", label: "2. Cloudinary Media" },
                { id: "guide", label: "3. Sightseeing & How to Reach" },
                { id: "seo", label: "4. SEO & Status" },
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

            {/* Modal Form */}
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

              {/* TAB 1: BASIC */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Place Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Dawki & Umngot River"
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
                        placeholder="e.g. dawki-river"
                        required
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Destination State / Region *
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
                        Best Time to Visit
                      </label>
                      <input
                        type="text"
                        value={formData.bestTimeToVisit}
                        onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                        placeholder="e.g. November to April"
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Short Description / Card Preview
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="e.g. World-famous crystal clear river bordering Bangladesh offering boating and camping."
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Travel Guide Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed background history, beauty, and local experience..."
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
                      label="Place Hero Image (Cloudinary Hosted)"
                      value={formData.heroImage}
                      onChange={(url) => setFormData({ ...formData, heroImage: url })}
                      folder="ne_dhaniya_tours/places"
                      hint="Scenic landscape photograph representing the destination"
                    />
                  </div>

                  <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
                    <CloudinaryGalleryUpload
                      label="Destination Photo Gallery"
                      values={formData.gallery || []}
                      onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                      folder="ne_dhaniya_tours/places/gallery"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: GUIDE & REACH */}
              {activeTab === "guide" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Top Things To Do & Highlights (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(formData.topThingsToDo || []).join("\n")}
                      onChange={(e) => handleThingsToDoText(e.target.value)}
                      placeholder="Boating on crystal river&#10;Cliff jumping & kayaking&#10;Visit Dawki suspension bridge"
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      How To Reach
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">By Air</label>
                        <input
                          type="text"
                          value={formData.howToReach?.byAir || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            howToReach: { ...formData.howToReach, byAir: e.target.value }
                          })}
                          placeholder="e.g. Guwahati Airport (GAU) - 170km"
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">By Rail</label>
                        <input
                          type="text"
                          value={formData.howToReach?.byRail || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            howToReach: { ...formData.howToReach, byRail: e.target.value }
                          })}
                          placeholder="e.g. Guwahati Railway Station - 160km"
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">By Road</label>
                        <input
                          type="text"
                          value={formData.howToReach?.byRoad || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            howToReach: { ...formData.howToReach, byRoad: e.target.value }
                          })}
                          placeholder="e.g. NH6 via Shillong; cabs available"
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Travel Tips & Important Guidelines (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(formData.travelTips || []).join("\n")}
                      onChange={(e) => handleTravelTipsText(e.target.value)}
                      placeholder="Start early in morning to avoid tourist rush&#10;Carry cash as ATMs are sparse&#10;Wear comfortable non-slip trekking footwear"
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: SEO */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle || ""}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="e.g. Dawki Tourism & Taxi Booking | NE Dhaniya Tours"
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
                      placeholder="Travel guide, taxi fare, and best sightseeing in Dawki Umngot river."
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : editingPlace ? "Update Tourist Place" : "Save Tourist Place"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
