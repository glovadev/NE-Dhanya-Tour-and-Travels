"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Compass, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Save, 
  AlertTriangle,
  MapPin
} from "lucide-react";
import { 
  getAllDestinations, 
  saveDestination, 
  deleteDestination 
} from "@/lib/firebase/dataBridge";
import { Destination } from "@/types";
import CloudinaryUpload, { CloudinaryGalleryUpload } from "@/components/admin/CloudinaryUpload";

const emptyDestination: Omit<Destination, "id"> & { id?: string } = {
  name: "",
  slug: "",
  state: "",
  shortDescription: "",
  description: "",
  heroImage: "",
  gallery: [],
  bestTimeToVisit: "October to May",
  howToReach: {
    byAir: "Connected via regional airports (Guwahati, Shillong, Bagdogra, Dibrugarh).",
    byRail: "Guwahati is the main broad-gauge railway hub connected across India.",
    byRoad: "Well maintained National Highways connecting major regional valleys."
  },
  travelTips: [
    "Check inner line permit (ILP) requirements where applicable",
    "Keep photo IDs handy for border checkpoints",
    "Carry light woolens even in mild seasons"
  ],
  popularPlaces: [],
  faqs: [],
  seoTitle: "",
  seoDescription: "",
  status: "published",
  featured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [formData, setFormData] = useState<any>(emptyDestination);
  const [activeTab, setActiveTab] = useState<"basic" | "media" | "seo">("basic");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchDestinations = async () => {
    setLoading(true);
    const data = await getAllDestinations();
    setDestinations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDestinations();
    const handleUpdate = () => fetchDestinations();
    window.addEventListener("ne_dhanya_destinations_updated", handleUpdate);
    return () => window.removeEventListener("ne_dhanya_destinations_updated", handleUpdate);
  }, []);

  const openCreateModal = () => {
    setEditingDest(null);
    setFormData({
      ...emptyDestination,
      id: `dest-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setActiveTab("basic");
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dest: Destination) => {
    setEditingDest(dest);
    setFormData({ ...dest });
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
      state: prev.state ? prev.state : name,
      slug: prev.slug && editingDest ? prev.slug : slug,
      seoTitle: prev.seoTitle ? prev.seoTitle : `${name} Tour Packages & Taxi Services | NE Dhaniya Tours`,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatusMessage({ type: "error", text: "Please enter Destination Name." });
      setActiveTab("basic");
      return;
    }
    if (!formData.slug.trim()) {
      setStatusMessage({ type: "error", text: "Destination Slug is required." });
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
      const payload: Destination = {
        ...formData,
        id: formData.id || formData.slug,
        updatedAt: new Date().toISOString(),
      };

      await saveDestination(payload);
      await fetchDestinations();
      setStatusMessage({ type: "success", text: "Destination saved successfully!" });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 700);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err?.message || "Failed to save destination." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dest: Destination) => {
    try {
      await deleteDestination(dest.slug || dest.id);
      await fetchDestinations();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Failed to delete destination:", err);
    }
  };

  const filteredDestinations = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">
            Destinations & Regions CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage Northeast India states, Bhutan, regional SEO landing pages, and Cloudinary hero banners.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Region</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destinations by state or title..."
          className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-slate-400 text-sm py-16 text-center">Loading destinations...</div>
      ) : filteredDestinations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Destinations Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Add Custom Region" to configure a new tourist state or region.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Region
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id || dest.slug}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors group"
            >
              <div className="space-y-3">
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900">
                  <Image
                    src={dest.heroImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow">
                    {dest.status}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{dest.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {dest.shortDescription || dest.description}
                  </p>
                </div>

                <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Best Time:</span>
                    <span className="font-semibold text-white truncate max-w-[150px]">{dest.bestTimeToVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SEO Title:</span>
                    <span className="text-emerald-400 truncate max-w-[150px]">{dest.seoTitle}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(dest)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit</span>
                  </button>

                  <Link
                    href={`/destinations/${dest.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-900"
                    title="View public destination page"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Published
                  </span>

                  <button
                    onClick={() => setDeleteConfirmId(dest.slug || dest.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                    title="Delete destination"
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
              <h3 className="text-base font-bold text-white">Delete Destination Region?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This will remove this state/region from destination listings and filters.
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
                  const target = destinations.find(d => d.slug === deleteConfirmId || d.id === deleteConfirmId);
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

      {/* Add / Edit Destination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingDest ? `Edit: ${editingDest.name}` : "Add Destination Region"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    State details, regional info, and Cloudinary hero photo
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

            {/* Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
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

              {/* Cloudinary Hero Photo */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
                <CloudinaryUpload
                  label="Destination Hero Banner (Stored in Cloudinary) *"
                  value={formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  folder="ne_dhaniya_tours/destinations"
                  hint="Scenic panoramic photo of the state/region"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Meghalaya"
                    required
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Slug ID *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. meghalaya"
                    required
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={formData.bestTimeToVisit}
                    onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                    placeholder="e.g. October to May"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Abode of Clouds: Waterfalls, Caves & Living Root Bridges"
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Destination Overview Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of the state, culture, and travel attractions..."
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle || ""}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="e.g. Meghalaya Tour Packages & Taxi Services | NE Dhaniya Tours"
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

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
                  <span>{saving ? "Saving..." : editingDest ? "Update Destination" : "Save Destination"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
