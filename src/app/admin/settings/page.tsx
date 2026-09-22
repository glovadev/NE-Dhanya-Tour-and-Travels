"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle, Globe, Phone, Mail, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getSiteSettings, saveSiteSettings } from "@/lib/firebase/dataBridge";
import { SiteSettings } from "@/types";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSaved(false);

    await saveSiteSettings(settings);
    setSaving(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) {
    return <div className="text-slate-400 text-sm py-12 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">
            Website & WhatsApp Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centrally manage your business WhatsApp number, contact details, and default SEO tags.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Settings saved successfully! All WhatsApp CTAs now use the updated configuration.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core WhatsApp & Contact Card */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider pb-3 border-b border-slate-800">
            <WhatsAppIcon className="w-4 h-4 text-[#25D366] fill-current" />
            <span>Primary WhatsApp & Direct Contacts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Central WhatsApp Number (Without + or spaces) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="e.g. 919387843282"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Used by every floating button, package quote, and trip planner across the website.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Phone Number *
              </label>
              <input
                type="text"
                required
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                placeholder="e.g. +91 93878 43282"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Secondary Phone Number
              </label>
              <input
                type="text"
                value={settings.secondaryPhoneNumber || ""}
                onChange={(e) => setSettings({ ...settings, secondaryPhoneNumber: e.target.value })}
                placeholder="e.g. +91 98640 66495"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Office Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Brand Information */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-slate-300 text-sm font-bold uppercase tracking-wider pb-3 border-b border-slate-800">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Brand Positioning & SEO Defaults</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
            <input
              type="text"
              required
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Meta Title</label>
            <input
              type="text"
              value={settings.defaultMetaTitle}
              onChange={(e) => setSettings({ ...settings, defaultMetaTitle: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Meta Description</label>
            <textarea
              rows={3}
              value={settings.defaultMetaDescription}
              onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <CloudinaryUpload
              label="Default Social Share / OpenGraph Image (Cloudinary Hosted)"
              value={settings.defaultOgImage}
              onChange={(url) => setSettings({ ...settings, defaultOgImage: url })}
              folder="ne_dhaniya_tours/branding"
              hint="Recommended: 1200 x 630 px landscape image"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
        </button>

      </form>
    </div>
  );
}
