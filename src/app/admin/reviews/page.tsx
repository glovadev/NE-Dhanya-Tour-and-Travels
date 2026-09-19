"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Clock, 
  MapPin, 
  Compass, 
  Car, 
  Filter, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  AlertCircle,
  RotateCw
} from "lucide-react";
import { getAllReviews, updateReviewStatus, deleteReview } from "@/lib/firebase/dataBridge";
import { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    const handleUpdate = () => {
      fetchReviews();
    };

    window.addEventListener("ne_dhanya_reviews_updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("ne_dhanya_reviews_updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const success = await updateReviewStatus(id, "approved");
      if (success) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
        showToast("Review approved! It is now visible on the client website.");
      }
    } catch (err) {
      console.error("Failed to approve review", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const success = await updateReviewStatus(id, "rejected");
      if (success) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
        showToast("Review marked as rejected.");
      }
    } catch (err) {
      console.error("Failed to reject review", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the review from ${name}?`)) {
      return;
    }
    setProcessingId(id);
    try {
      const success = await deleteReview(id);
      if (success) {
        setReviews(prev => prev.filter(r => r.id !== id));
        showToast("Review deleted successfully.");
      }
    } catch (err) {
      console.error("Failed to delete review", err);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = reviews.filter(r => r.status === "pending").length;
  const approvedCount = reviews.filter(r => r.status === "approved").length;
  const rejectedCount = reviews.filter(r => r.status === "rejected").length;

  const filteredReviews = reviews.filter(r => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white font-heading">
              Reviews & Testimonials CMS
            </h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
                <Clock className="w-3 h-3" />
                <span>{pendingCount} Pending Approval</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review guest feedback, approve authentic travel testimonials, and manage public visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchReviews}
            disabled={loading}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
            title="Reload reviews"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/#testimonials"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Slider</span>
          </a>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Reviews</span>
          <p className="text-2xl font-extrabold text-white mt-1">{reviews.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 bg-amber-500/5">
          <span className="text-xs font-semibold text-amber-400">Pending Review</span>
          <p className="text-2xl font-extrabold text-amber-300 mt-1">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 bg-emerald-500/5">
          <span className="text-xs font-semibold text-emerald-400">Approved & Live</span>
          <p className="text-2xl font-extrabold text-emerald-300 mt-1">{approvedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Rejected / Hidden</span>
          <p className="text-2xl font-extrabold text-slate-400 mt-1">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            filter === "all" 
              ? "bg-emerald-600 text-white shadow-md" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          All ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            filter === "pending" 
              ? "bg-amber-600 text-white shadow-md" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span>Pending</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            filter === "approved" 
              ? "bg-emerald-600 text-white shadow-md" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          Approved Live ({approvedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            filter === "rejected" 
              ? "bg-rose-600 text-white shadow-md" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-sm">
          Loading reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center bg-slate-950 rounded-3xl border border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No reviews found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filter === "pending" 
              ? "Great! All submitted reviews have been reviewed." 
              : "No reviews match the selected filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className={`rounded-3xl bg-slate-950 border p-6 flex flex-col justify-between space-y-5 transition-all ${
                r.status === "pending"
                  ? "border-amber-500/40 shadow-lg shadow-amber-500/5"
                  : r.status === "approved"
                  ? "border-slate-800 hover:border-emerald-500/30"
                  : "border-rose-900/30 opacity-70"
              }`}
            >
              <div className="space-y-4">
                
                {/* Header: User & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-800 bg-slate-900 shrink-0">
                      {r.avatar ? (
                        <Image
                          src={r.avatar}
                          alt={r.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-emerald-400">
                          {r.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {r.name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{r.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator Badge */}
                  <div>
                    {r.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                        <Clock className="w-3 h-3" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                    {r.status === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Live on Website</span>
                      </span>
                    )}
                    {r.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold">
                        <XCircle className="w-3 h-3" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating & Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    {r.tourName}
                  </span>
                  {r.travelMode && (
                    <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                      {r.travelMode}
                    </span>
                  )}
                </div>

                {/* Highlight Headline */}
                {r.highlight && (
                  <p className="text-xs sm:text-sm font-bold text-slate-200">
                    &ldquo;{r.highlight}&rdquo;
                  </p>
                )}

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-900 italic">
                  &ldquo;{r.review}&rdquo;
                </p>

                {/* Date */}
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Submitted on {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>

              </div>

              {/* Actions Row */}
              <div className="pt-4 border-t border-slate-900 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={processingId === r.id}
                  onClick={() => handleDelete(r.id, r.name)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  {r.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={processingId === r.id}
                      onClick={() => handleReject(r.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}

                  {r.status !== "approved" && (
                    <button
                      type="button"
                      disabled={processingId === r.id}
                      onClick={() => handleApprove(r.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve for Website</span>
                    </button>
                  )}

                  {r.status === "approved" && (
                    <span className="text-[11px] text-emerald-400 font-semibold px-2 py-1">
                      Active on Homepage
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
