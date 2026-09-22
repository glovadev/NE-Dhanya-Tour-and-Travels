"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Plus, Eye, Clock, User, Check, Sparkles } from "lucide-react";
import { getAllBlogPosts, saveBlogPost } from "@/lib/firebase/dataBridge";
import { BlogPost } from "@/types";
import { SeoPreview } from "@/components/admin/SeoPreview";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  // New post form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Meghalaya");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState("https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=1000&q=80");

  useEffect(() => {
    getAllBlogPosts().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
    setSeoTitle(`${val} | NE Dhanya Tour and Travels`);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert("Please provide at least a title and slug.");
      return;
    }

    const newPost: BlogPost = {
      id: slug,
      title,
      slug,
      excerpt: excerpt || title,
      content: content || "Practical travel guide content for Northeast India.",
      featuredImage,
      category,
      tags: [category, "Travel Guide"],
      author: "NE Dhanya Travel Desk",
      readingTime: "5 min read",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "published",
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      createdAt: new Date().toISOString(),
    };

    await saveBlogPost(newPost);
    setBlogs([newPost, ...blogs]);
    setShowEditor(false);
    alert("Blog post published successfully and integrated into public website!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">
            Blog & SEO Travel Guides CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish high-intent SEO articles to attract organic Google search traffic and convert visitors to WhatsApp enquiries.
          </p>
        </div>

        <button
          onClick={() => setShowEditor(!showEditor)}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showEditor ? "Close Editor" : "Write New Article"}</span>
        </button>
      </div>

      {/* Write New Article Drawer / Form */}
      {showEditor && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-emerald-500/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Create New SEO Travel Guide</span>
            </h2>
            <button
              onClick={() => setShowEditor(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveBlog} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 10 Best Places to Visit in Meghalaya"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Assam">Assam</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Travel Tips">Travel Tips</option>
                  <option value="Car Rental">Car Rental</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <CloudinaryUpload
                  label="Featured Article Cover Image (Cloudinary Hosted)"
                  value={featuredImage}
                  onChange={(url) => setFeaturedImage(url)}
                  folder="ne_dhaniya_tours/blogs"
                  hint="High-resolution landscape photo for article header"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Excerpt / Summary (for Google meta snippet)</label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setSeoDescription(e.target.value);
                }}
                placeholder="Short attractive summary..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Article Content (Markdown / Text)</label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full travel guide here with headings and practical tips..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* Live SEO Preview */}
            <div className="pt-2">
              <SeoPreview
                title={seoTitle || title}
                slug={slug}
                description={seoDescription || excerpt}
                basePath="blog"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
              >
                Publish Article to Website
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs List */}
      {loading ? (
        <div className="text-slate-400 text-sm py-12 text-center">Loading articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="relative h-40 w-full rounded-xl overflow-hidden">
                  <Image
                    src={b.featuredImage}
                    alt={b.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/90 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    {b.category}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white line-clamp-2">{b.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{b.excerpt}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <Link
                  href={`/blog/${b.slug}`}
                  target="_blank"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </Link>
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Published
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
