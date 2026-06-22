import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

export default function DashboardAnalytics() {
  const { authHeaders } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/dashboard/summary`, { headers });
      if (!res.ok) throw new Error("Failed to fetch dashboard summary");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || "Failed to load dashboard data");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-100" />
          <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
        </div>
        <p className="mt-5 text-sm font-semibold text-slate-500 animate-pulse">
          Analyzing financial metrics…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center max-w-lg mx-auto mt-10">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="font-bold text-red-700">Analytics Error</h3>
        <p className="mt-1 text-sm text-red-500">{error}</p>
        <button
          onClick={fetchSummary}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { totalIncome = 0, totalExpense = 0, netProfit = 0, recentTransactions = [], breakdown = {} } = data || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">📈 Business Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time financial performance and overview of your micro-enterprise.</p>
        </div>
        <button
          onClick={fetchSummary}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Income Card */}
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 shadow-sm flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white text-2xl shadow-md shadow-emerald-500/20">
            📥
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Income</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{totalIncome.toLocaleString("en-IN")}</h3>
            <p className="text-xs text-slate-400 mt-1">From voice transactions</p>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-6 shadow-sm flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white text-2xl shadow-md shadow-rose-500/20">
            📤
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{totalExpense.toLocaleString("en-IN")}</h3>
            <p className="text-xs text-slate-400 mt-1">Spoken entries cataloged</p>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className={`rounded-3xl border p-6 shadow-sm flex items-start gap-4 ${
          netProfit >= 0 
            ? "border-blue-100 bg-blue-50/40" 
            : "border-amber-100 bg-amber-50/40"
        }`}>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white text-2xl shadow-md ${
            netProfit >= 0 ? "bg-blue-600 shadow-blue-600/20" : "bg-amber-500 shadow-amber-500/20"
          }`}>
            🏆
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${
              netProfit >= 0 ? "text-blue-600" : "text-amber-600"
            }`}>
              Net Profit
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {netProfit < 0 ? "-" : ""}₹{Math.abs(netProfit).toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Current net balance</p>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Recent Feed */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left columns: Breakdowns */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">📊 Category Breakdown</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Income Categories */}
              <div>
                <h4 className="text-sm font-bold text-emerald-600 border-b border-slate-100 pb-2 mb-4">Incomes</h4>
                {Object.keys(breakdown.income || {}).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No income breakdowns available</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(breakdown.income).map(([cat, val]) => {
                      const percentage = totalIncome > 0 ? Math.round((val / totalIncome) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-600 capitalize">
                            <span>{cat}</span>
                            <span>₹{val} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Expense Categories */}
              <div>
                <h4 className="text-sm font-bold text-rose-600 border-b border-slate-100 pb-2 mb-4">Expenses</h4>
                {Object.keys(breakdown.expense || {}).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No expense breakdowns available</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(breakdown.expense).map(([cat, val]) => {
                      const percentage = totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-600 capitalize">
                            <span>{cat}</span>
                            <span>₹{val} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right columns: Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">🕒 Recent Activity</h3>
            
            {recentTransactions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                <span className="text-3xl mb-2">💸</span>
                <p className="text-sm text-slate-500 font-medium">No transactions recorded yet.</p>
                <p className="text-xs text-slate-400 mt-1">Transactions recorded in the Voice Ledger will appear here.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {recentTransactions.map((t) => {
                  const dateStr = t.createdAt 
                    ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Date N/A";

                  return (
                    <div key={t.id} className="flex justify-between items-start p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                      <div className="space-y-0.5 max-w-[70%]">
                        <p className="font-semibold text-sm text-slate-800 truncate" title={t.description}>
                          {t.description}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">{dateStr}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold block ${
                          t.type === "income" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {t.type === "income" ? "+" : "-"} ₹{t.amount}
                        </span>
                        <span className={`inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full mt-1 ${
                          t.type === "income" 
                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10" 
                            : "bg-rose-50 text-rose-600 ring-1 ring-rose-500/10"
                        }`}>
                          {t.type}
                        </span>
                      </div>
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
