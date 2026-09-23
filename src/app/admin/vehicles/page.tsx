"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Car, 
  Users, 
  Wind, 
  Check, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Search, 
  Save, 
  Luggage, 
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { 
  getAllVehicles, 
  saveVehicle, 
  deleteVehicle 
} from "@/lib/firebase/dataBridge";
import { Vehicle } from "@/types";
import CloudinaryUpload, { CloudinaryGalleryUpload } from "@/components/admin/CloudinaryUpload";

const emptyVehicle: Omit<Vehicle, "id"> & { id?: string } = {
  name: "",
  slug: "",
  seatingCapacity: "6+1 Seater",
  description: "",
  image: "",
  gallery: [],
  idealFor: "Family and Group Mountain Tours",
  comfortLevel: "Luxury Captain Seats",
  luggageCapacity: "3-4 Large Bags",
  acAvailable: true,
  status: "active",
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<any>(emptyVehicle);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    const data = await getAllVehicles();
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
    const handleUpdate = () => fetchVehicles();
    window.addEventListener("ne_dhanya_vehicles_updated", handleUpdate);
    return () => window.removeEventListener("ne_dhanya_vehicles_updated", handleUpdate);
  }, []);

  const openCreateModal = () => {
    setEditingVehicle(null);
    setFormData({
      ...emptyVehicle,
      id: `veh-${Date.now()}`,
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData({ ...v });
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
      slug: prev.slug && editingVehicle ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatusMessage({ type: "error", text: "Please enter Vehicle Name." });
      return;
    }
    if (!formData.slug.trim()) {
      setStatusMessage({ type: "error", text: "Vehicle Slug is required." });
      return;
    }
    if (!formData.image.trim()) {
      setStatusMessage({ type: "error", text: "Please upload a vehicle image to Cloudinary." });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const payload: Vehicle = {
        ...formData,
        id: formData.id || formData.slug,
      };

      const ok = await saveVehicle(payload);
      if (!ok) {
        throw new Error("Failed to save vehicle to database. Please check connection and try again.");
      }
      await fetchVehicles();
      setStatusMessage({ type: "success", text: "Vehicle saved successfully!" });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 700);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err?.message || "Failed to save vehicle." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    try {
      const ok = await deleteVehicle(vehicle.slug || vehicle.id);
      if (!ok) {
        alert("Failed to delete vehicle from database. Please try again.");
        return;
      }
      await fetchVehicles();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
    }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.seatingCapacity.toLowerCase().includes(search.toLowerCase()) ||
    v.idealFor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">
            Vehicle Fleet CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your transport fleet for private car rentals, shared trips, seating specs, and Cloudinary photos.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vehicles by model, capacity, or specs..."
          className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Grid of Vehicles */}
      {loading ? (
        <div className="text-slate-400 text-sm py-16 text-center">Loading vehicle fleet...</div>
      ) : filteredVehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <Car className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Vehicles Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Add New Vehicle" to add sedans, SUVs, or tempo travellers to your fleet.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map((v) => (
            <div
              key={v.id || v.slug}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors group"
            >
              <div className="space-y-3">
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900">
                  <Image
                    src={v.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"}
                    alt={v.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 border border-emerald-500/20">
                    <Users className="w-3 h-3" />
                    <span>{v.seatingCapacity}</span>
                  </div>
                  {v.acAvailable && (
                    <div className="absolute bottom-2 left-2 bg-sky-950/80 backdrop-blur-md text-sky-400 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 border border-sky-800/40">
                      <Wind className="w-3 h-3" /> AC
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{v.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {v.description}
                  </p>
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Best For:</span>
                    <span className="text-slate-200 truncate max-w-[140px] font-medium">{v.idealFor}</span>
                  </div>
                  {v.comfortLevel && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Comfort:</span>
                      <span className="text-emerald-400 font-medium truncate max-w-[140px]">{v.comfortLevel}</span>
                    </div>
                  )}
                  {v.luggageCapacity && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Luggage:</span>
                      <span className="text-slate-300 font-medium">{v.luggageCapacity}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
                <button
                  onClick={() => openEditModal(v)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    v.status === "active" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" : "bg-slate-800 text-slate-400"
                  }`}>
                    {v.status}
                  </span>

                  <button
                    onClick={() => setDeleteConfirmId(v.slug || v.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                    title="Delete vehicle"
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
              <h3 className="text-base font-bold text-white">Delete Vehicle?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This vehicle will be removed from your fleet selection and booking options.
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
                  const target = vehicles.find(v => v.slug === deleteConfirmId || v.id === deleteConfirmId);
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

      {/* Main Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingVehicle ? `Edit: ${editingVehicle.name}` : "Add New Fleet Vehicle"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Vehicle specs, seating options, and Cloudinary car photo
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

              {/* Cloudinary Vehicle Photo */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
                <CloudinaryUpload
                  label="Vehicle Photo (Stored in Cloudinary) *"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="ne_dhaniya_tours/fleet"
                  hint="Clear landscape photo of vehicle exterior or interior"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vehicle Model Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Toyota Innova Crysta"
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
                    placeholder="e.g. innova-crysta"
                    required
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Seating Capacity *
                  </label>
                  <input
                    type="text"
                    value={formData.seatingCapacity}
                    onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
                    placeholder="e.g. 6+1 Seater"
                    required
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Comfort Level
                  </label>
                  <input
                    type="text"
                    value={formData.comfortLevel || ""}
                    onChange={(e) => setFormData({ ...formData, comfortLevel: e.target.value })}
                    placeholder="e.g. Luxury Captain Seats"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Luggage Capacity
                  </label>
                  <input
                    type="text"
                    value={formData.luggageCapacity || ""}
                    onChange={(e) => setFormData({ ...formData, luggageCapacity: e.target.value })}
                    placeholder="e.g. 4 Large Bags"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Best For / Ideal For
                  </label>
                  <input
                    type="text"
                    value={formData.idealFor}
                    onChange={(e) => setFormData({ ...formData, idealFor: e.target.value })}
                    placeholder="e.g. Executive Trips, Family Mountain Tours"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.acAvailable !== false}
                        onChange={(e) => setFormData({ ...formData, acAvailable: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-800"
                      />
                      <span className="text-xs font-semibold text-slate-300">Air Conditioned</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vehicle Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about vehicle condition, hill performance, legroom, and amenities..."
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
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
                  <span>{saving ? "Saving..." : editingVehicle ? "Update Vehicle" : "Add Vehicle to Fleet"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
