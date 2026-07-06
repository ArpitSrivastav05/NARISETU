import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Sparkles, TrendingUp, TrendingDown, Info, AlertTriangle, Target, CheckCircle2, RefreshCw } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-purple-100 flex items-center justify-center relative mb-4">
          <Sparkles className="text-purple-500 animate-pulse" size={24} />
          <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Compiling Intelligence Feed...</h2>
        <p className="mt-2 text-sm text-slate-500">Gemini 2.5 is analyzing your business data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-center max-w-lg mx-auto mt-10">
        <AlertTriangle className="mx-auto text-rose-500 mb-4" size={48} />
        <h3 className="text-lg font-bold text-rose-900 mb-2">System Interruption</h3>
        <p className="text-sm text-rose-600 mb-6">{error}</p>
        <button onClick={fetchFeed} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition shadow-sm">
          Try Again
        </button>
      </div>
    );
  }

  const { briefing, roadmap = [], predictive = {}, notifications = [] } = feed || {};

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header & Daily Briefing */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-amber-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">Daily AI Briefing</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 leading-tight">Good to see you!</h1>
          <p className="text-purple-100 text-lg max-w-2xl leading-relaxed">{briefing}</p>
        </div>
        <button onClick={fetchFeed} className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition text-sm font-bold">
          <RefreshCw size={16} /> Update Feed
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Predictive & Roadmap */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Predictive Analytics */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="text-teal-500" /> 7-Day Forecast
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Projected Revenue</p>
                <p className="text-3xl font-black text-emerald-600">₹{predictive.predictedRevenue?.toLocaleString("en-IN") || 0}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Projected Expenses</p>
                <p className="text-3xl font-black text-rose-600">₹{predictive.predictedExpense?.toLocaleString("en-IN") || 0}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-800">
              <Info className="shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-medium leading-relaxed">{predictive.trendInsight}</p>
            </div>
          </div>

          {/* Business Roadmap */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Target className="text-purple-500" /> Business Roadmap
            </h2>
            <div className="space-y-4">
              {roadmap.map((step, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition cursor-default group bg-white">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Notifications & Quick Actions */}
        <div className="space-y-8">
          
          {/* Smart Notifications */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Smart Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">No new notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((note, i) => {
                  let colors = "bg-slate-50 border-slate-100 text-slate-700";
                  let Icon = Info;
                  if (note.type === "warning") {
                    colors = "bg-rose-50 border-rose-100 text-rose-800";
                    Icon = AlertTriangle;
                  } else if (note.type === "success") {
                    colors = "bg-emerald-50 border-emerald-100 text-emerald-800";
                    Icon = CheckCircle2;
                  }
                  
                  return (
                    <div key={i} className={`p-4 rounded-2xl border flex gap-3 items-start ${colors}`}>
                      <Icon className="shrink-0 mt-0.5" size={18} />
                      <p className="text-sm font-medium">{note.message}</p>
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
