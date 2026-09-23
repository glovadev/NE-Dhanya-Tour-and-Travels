import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, ArrowRight, User, Tag } from "lucide-react";
import { getAllBlogPosts, getAllBlogCategories, getSiteSettings } from "@/lib/firebase/dataBridge";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";

export const metadata: Metadata = {
  title: "Northeast India Travel Guide & Blog | NE Dhanya Tour and Travels",
  description: "Comprehensive travel guides, route maps, permit rules & seasonal tips for Meghalaya, Assam, Tawang, Sikkim & Bhutan by local Northeast experts.",
  alternates: {
    canonical: "/blog",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogIndexPage() {
  const blogs = await getAllBlogPosts();
  const categories = await getAllBlogCategories();

  return (
    <div className="pt-24 pb-20 bg-nature-bg min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Travel Guide", url: "/blog" }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Northeast Travel Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 font-heading">
            Travel Guides & Articles
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Written by local travelers to help you discover the hidden gems, weather patterns, road conditions, and rich culture of Northeast India & Bhutan.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Topics:
          </span>
          {categories.map((c) => (
            <span
              key={c.id}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 transition-colors shrink-0 cursor-default"
            >
              {c.name}
            </span>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                  {blog.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readingTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {blog.author}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-forest-700 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 group-hover:text-forest-900 transition-colors"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

    </div>
  );
}
