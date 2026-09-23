import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, 
  User, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Package, 
  Share2,
  Tag
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { 
  getBlogPostBySlug, 
  getSiteSettings, 
  getDestinationBySlug, 
  getPackageBySlug 
} from "@/lib/firebase/dataBridge";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { getArticleSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { FAQAccordion } from "@/components/public/FAQAccordion";

interface Props {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogPostBySlug(params.slug);
  if (!blog) return {};

  return {
    title: blog.seoTitle || `${blog.title} | NE Dhanya Tour and Travels`,
    description: blog.seoDescription || blog.excerpt,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt || blog.publishedAt,
      authors: [blog.author],
      images: [{ url: blog.featuredImage, alt: blog.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const blog = await getBlogPostBySlug(params.slug);
  if (!blog) {
    notFound();
  }

  const settings = await getSiteSettings();
  const articleSchema = getArticleSchema(blog);

  const articleWhatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    `Hello NE Dhanya Tour and Travels, I read your article "${blog.title}" and would like assistance planning my trip.`
  );

  return (
    <div className="bg-nature-bg min-h-screen">
      
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            priority
            className="object-cover object-center brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {blog.category}
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight font-heading">
            {blog.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              {blog.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              {blog.readingTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Breadcrumbs
          items={[
            { name: "Travel Guide", url: "/blog" },
            { name: blog.title, url: `/blog/${blog.slug}` },
          ]}
        />
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        <article className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-100 shadow-sm leading-relaxed text-slate-700">
          
          {/* Excerpt Lead */}
          <div className="text-base sm:text-lg font-medium text-slate-800 border-l-4 border-emerald-600 pl-4 py-1 mb-8 italic bg-emerald-50/50 rounded-r-xl">
            {blog.excerpt}
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none space-y-6 text-sm sm:text-base whitespace-pre-line leading-relaxed">
            {blog.content}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400" />
              {blog.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

        </article>

        {/* FAQs if present */}
        {blog.faqs && blog.faqs.length > 0 && (
          <FAQAccordion faqs={blog.faqs} title="Article FAQs" />
        )}

        {/* Related Commercial Conversions (Section 39: Connecting blog to tour & vehicle pages) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            Related Travel Resources:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <Link
              href="/tour-packages"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-forest-50 text-slate-700 hover:text-forest-800 border border-slate-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Explore Tour Packages</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/car-rental"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-forest-50 text-slate-700 hover:text-forest-800 border border-slate-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Book Cabs & Car Rental</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* End-of-article WhatsApp CTA (Section 53) */}
        <div className="rounded-3xl bg-forest-900 text-white p-8 sm:p-12 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            Expert Travel Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Planning Your Northeast India Trip?
          </h2>
          <p className="text-xs sm:text-base text-slate-200 max-w-lg mx-auto leading-relaxed">
            Talk directly with NE Dhanya Tour and Travels on WhatsApp for customized itineraries, vehicle bookings, and honest local advice.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={articleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Plan My Trip on WhatsApp</span>
            </a>
            <Link
              href="/tour-packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <span>Explore Tour Packages</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
