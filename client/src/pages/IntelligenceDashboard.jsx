import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Sparkles, TrendingUp, Info, AlertTriangle, Target, CheckCircle2, RefreshCw, Bell } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

export default function IntelligenceDashboard() {
  const { authHeaders } = useAuth();
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/ai/intelligence-feed`, { headers });
      if (!res.ok) throw new Error("Failed to fetch intelligence feed");
      const result = await res.json();
      if (result.success) {
        setFeed(result.data);
      } else {
        throw new Error(result.error || "Failed to load feed");
      }
    } catch (err) {
      console.error(err);
      setError("AI Engine temporarily unavailable. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-2xl border border-slate-100">
        <RefreshCw className="h-10 w-10 text-[#B85042] animate-spin mb-6" />
        <h2 className="text-xl font-bold text-[#0B192C]">Compiling Intelligence Feed...</h2>
        <p className="mt-2 text-base text-slate-500">Gemini 2.5 is analyzing your business data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-left max-w-2xl mx-auto mt-12">
        <div className="flex h-12 w-12 mb-6 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-bold text-red-900 mb-2">System Interruption</h3>
        <p className="text-base text-red-700 mb-8 font-medium">{error}</p>
        <button
          onClick={fetchFeed}
          className="inline-flex items-center gap-2 min-h-[48px] px-6 bg-[#B85042] text-white rounded-xl text-base font-semibold hover:bg-[#9d4438] transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  const { briefing, roadmap = [], predictive = {}, notifications = [] } = feed || {};

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header & Daily Briefing — hero element */}
      <div className="bg-[#B85042] rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-[#FBBF24]" size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider text-white/70">Daily AI Briefing</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 leading-tight">Good to see you!</h1>
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed">{briefing}</p>
          </div>
          <button
            onClick={fetchFeed}
            className="flex items-center gap-2 min-h-[48px] px-5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 transition text-base font-semibold cursor-pointer"
          >
            <RefreshCw size={16} /> Update Feed
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Predictive & Roadmap */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Predictive Analytics */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
                <TrendingUp className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div className="text-left pt-0.5">
                <h2 className="text-xl font-bold text-[#0B192C]">7-Day Forecast</h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">Projected Revenue</p>
                <p className="text-3xl font-black text-[#0B192C]">₹{predictive.predictedRevenue?.toLocaleString("en-IN") || 0}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">Projected Expenses</p>
                <p className="text-3xl font-black text-[#B85042]">₹{predictive.predictedExpense?.toLocaleString("en-IN") || 0}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#B85042]/5 border border-[#B85042]/15 text-[#0B192C]">
              <Info className="shrink-0 mt-0.5 text-[#B85042]" size={18} />
              <p className="text-base font-medium leading-relaxed">{predictive.trendInsight}</p>
            </div>
          </div>

          {/* Business Roadmap */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
                <Target className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div className="text-left pt-0.5">
                <h2 className="text-xl font-bold text-[#0B192C]">Business Roadmap</h2>
              </div>
            </div>
            <div className="space-y-4">
              {roadmap.map((step, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-[#B85042]/30 hover:shadow-sm transition cursor-default group bg-white">
                  <div className="w-10 h-10 rounded-full bg-[#B85042]/10 text-[#B85042] flex items-center justify-center shrink-0 font-bold group-hover:bg-[#B85042] group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B192C] mb-1 text-base">{step.title}</h3>
                    <p className="text-base text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Notifications */}
        <div className="space-y-8">
          
          {/* Smart Notifications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
                <Bell className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-bold text-[#0B192C]">Smart Notifications</h2>
            </div>
            {notifications.length === 0 ? (
              <p className="text-base text-slate-500">No new notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((note, i) => {
                  let colors = "bg-slate-50 border-slate-100 text-slate-700";
                  let Icon = Info;
                  if (note.type === "warning") {
                    colors = "bg-red-50 border-red-100 text-red-800";
                    Icon = AlertTriangle;
                  } else if (note.type === "success") {
                    colors = "bg-emerald-50 border-emerald-100 text-emerald-800";
                    Icon = CheckCircle2;
                  }
                  
                  return (
                    <div key={i} className={`p-4 rounded-xl border flex gap-3 items-start ${colors}`}>
                      <Icon className="shrink-0 mt-0.5" size={18} />
                      <p className="text-base font-medium">{note.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
