"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Image as ImageIcon, Link2, Check, RefreshCw } from "lucide-react";

interface CloudinaryUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
}

export default function CloudinaryUpload({
  value,
  onChange,
  folder = "ne_dhaniya_tours",
  label = "Upload Image",
  hint = "PNG, JPG, WEBP up to 10MB"
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload to Cloudinary failed");
      }

      onChange(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setManualUrl("");
    setIsUrlMode(false);
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          {isUrlMode ? (
            <>
              <UploadCloud className="w-3 h-3" /> Upload File
            </>
          ) : (
            <>
              <Link2 className="w-3 h-3" /> Paste Image Link
            </>
          )}
        </button>
      </div>

      {isUrlMode ? (
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
          >
            Apply
          </button>
        </form>
      ) : value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video max-h-48 w-full flex items-center justify-center">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1 shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1 shadow-lg"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-sm text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Cloudinary Hosted</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            uploading
              ? "border-emerald-500/50 bg-emerald-950/10 cursor-not-allowed"
              : "border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/50 bg-slate-950"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              <p className="text-xs font-medium text-slate-300">
                Uploading directly to Cloudinary...
              </p>
              <p className="text-[10px] text-slate-500">
                Optimizing & storing securely
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-1">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white hover:text-emerald-400">
                  Click to upload
                </span>
                <span className="text-slate-400"> or drag and drop</span>
              </div>
              <p className="text-[10px] text-slate-500">{hint}</p>
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Auto-synced to Cloudinary
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {error && (
        <p className="text-xs text-rose-400 font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// Multi Image Uploader for Galleries
export function CloudinaryGalleryUpload({
  values = [],
  onChange,
  folder = "ne_dhaniya_tours/gallery",
  label = "Gallery Images",
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls = [...values];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("folder", folder);

        const res = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          newUrls.push(data.url);
        }
      }
      onChange(newUrls);
    } catch (err) {
      console.error("Failed uploading gallery images:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label} ({values.length} uploaded)
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" /> Add Images
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {values.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {values.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden group border border-slate-800 bg-slate-900"
            >
              <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-rose-600/90 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-slate-800 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500/50 bg-slate-950 text-xs text-slate-400"
        >
          Click to add photos to gallery (Cloudinary hosted)
        </div>
      )}
    </div>
  );
}
