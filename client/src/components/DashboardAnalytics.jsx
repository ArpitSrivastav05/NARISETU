import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Store, 
  Package, 
  Bookmark, 
  Sparkles, 
  BarChart3, 
  Clock, 
  RefreshCw, 
  AlertTriangle 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

// Helper components for consistent styling
const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 mb-8">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
      <Icon className="h-6 w-6" strokeWidth={2.5} />
    </div>
    <div className="text-left pt-0.5">
      <h3 className="text-2xl font-bold text-[#0B192C]">{title}</h3>
      {description && <p className="text-base text-slate-500 mt-1">{description}</p>}
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between text-left min-h-[180px] transition-all hover:border-[#B85042]/30 hover:shadow-sm">
    <div className="flex items-center gap-4 mb-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
        <Icon className="h-6 w-6" strokeWidth={2.5} />
      </div>
      <p className="text-base font-semibold text-slate-500">{title}</p>
    </div>
    <div>
      <h3 className="text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight">{value}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
    </div>
  </div>
);

export default function DashboardAnalytics() {
  const { authHeaders } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(true);

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

  const fetchAISummary = async () => {
    setAiSummaryLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/ai/summary`, { headers });
      if (!res.ok) throw new Error("Failed to fetch AI summary");
      const result = await res.json();
      if (result.success) {
        setAiSummary(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAISummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-2xl border border-slate-100">
        <RefreshCw className="h-10 w-10 text-[#B85042] animate-spin mb-6" />
        <p className="text-base font-semibold text-[#0B192C] animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-left max-w-2xl mx-auto mt-12">
        <div className="flex h-12 w-12 mb-6 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-bold text-red-900 mb-2">Unable to load data</h3>
        <p className="text-base text-red-700 mb-8 font-medium">{error}</p>
        <button
          onClick={fetchSummary}
          className="inline-flex items-center gap-2 min-h-[48px] px-6 bg-[#B85042] text-white rounded-xl text-base font-semibold hover:bg-[#9d4438] transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpense = 0,
    netProfit = 0,
    totalProducts = 0,
    totalBusinesses = 0,
    savedSchemesCount = 0,
    recentTransactions = [],
    breakdown = {},
  } = data || {};

  const incomeData = Object.keys(breakdown.income || {}).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: breakdown.income[cat]
  }));

  const expenseData = Object.keys(breakdown.expense || {}).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: breakdown.expense[cat]
  }));

  const COLORS = ['#B85042', '#FBBF24', '#0B192C', '#64748b', '#cbd5e1'];

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto pb-24 pt-4">
      
      {/* Header Area */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="text-left">
          <h2 className="text-4xl font-bold text-[#0B192C] tracking-tight">Overview</h2>
          <p className="text-lg text-slate-500 mt-2">Welcome back to your business dashboard.</p>
        </div>
        <button
          onClick={fetchSummary}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 px-6 rounded-xl bg-slate-100 text-base font-semibold text-[#0B192C] hover:bg-slate-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Visual Anchor: Large Stat Callout for Net Profit */}
      <div className="rounded-[2rem] bg-[#B85042] text-white p-10 sm:p-14 text-left shadow-lg shadow-[#B85042]/20">
        <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-semibold mb-6">
          <span className="h-2 w-2 rounded-full bg-[#FBBF24]"></span>
          Current standing
        </div>
        <h2 className="text-6xl sm:text-7xl font-black mb-2 tracking-tighter leading-none">
          {netProfit < 0 ? "-" : ""}₹{Math.abs(netProfit).toLocaleString("en-IN")}
        </h2>
        <p className="text-xl font-medium text-white/80 mt-4">Net Balance</p>
      </div>

      {/* AI Summary */}
      {!aiSummaryLoading && aiSummary ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-left">
          <SectionHeader 
            icon={Sparkles} 
            title="AI Financial Analysis" 
            description="Smart insights derived from your recent activity." 
          />
          <div className="mt-2 text-lg text-[#0B192C] leading-relaxed">
            {aiSummary.summary}
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="text-xl font-bold text-[#0B192C]">Health Score</p>
              <p className="text-base text-slate-500 mt-1">Based on income to expense ratio</p>
            </div>
            <div className="text-5xl font-bold text-[#B85042] tracking-tighter">
              {aiSummary.financialHealth?.score ?? 0}<span className="text-2xl text-slate-400 font-medium">/100</span>
            </div>
          </div>

          {aiSummary.recommendations?.length ? (
            <div className="mt-10 space-y-3 border-t border-slate-100 pt-8">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Recommendations</p>
              <ul className="space-y-4">
                {aiSummary.recommendations.map((recommendation) => (
                  <li key={recommendation.title} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FBBF24]"></span>
                    <span className="text-base font-medium text-[#0B192C]">{recommendation.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Core Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <StatCard 
          icon={ArrowDownToLine} 
          title="Total Income" 
          value={`₹${totalIncome.toLocaleString("en-IN")}`}
          subtitle="All recorded earnings"
        />
        <StatCard 
          icon={ArrowUpFromLine} 
          title="Total Expenses" 
          value={`₹${totalExpense.toLocaleString("en-IN")}`}
          subtitle="All recorded spending"
        />
        <StatCard 
          icon={Store} 
          title="My Businesses" 
          value={totalBusinesses}
          subtitle="Registered profiles"
        />
        <StatCard 
          icon={Package} 
          title="Products Listed" 
          value={totalProducts}
          subtitle="Active in marketplace"
        />
        <StatCard 
          icon={Bookmark} 
          title="Saved Schemes" 
          value={savedSchemesCount}
          subtitle="Bookmarked government schemes"
        />
      </div>

      {/* Analytics Breakdown & Recent Activity */}
      <div className="space-y-12 pt-4">
        
        {/* Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-left">
          <SectionHeader 
            icon={BarChart3} 
            title="Category Breakdown" 
            description="Where your money is coming from and going." 
          />
          
          <div className="grid gap-12 sm:grid-cols-2 mt-8">
            {/* Income Categories */}
            <div>
              <h4 className="text-xl font-bold text-[#0B192C] border-b border-slate-100 pb-4 mb-6">Income Sources</h4>
              {incomeData.length === 0 ? (
                <p className="text-base text-slate-500 bg-slate-50 p-6 rounded-xl">No income data yet.</p>
              ) : (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {incomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Expense Categories */}
            <div>
              <h4 className="text-xl font-bold text-[#0B192C] border-b border-slate-100 pb-4 mb-6">Expense Areas</h4>
              {expenseData.length === 0 ? (
                <p className="text-base text-slate-500 bg-slate-50 p-6 rounded-xl">No expense data yet.</p>
              ) : (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity (Flat list style, intentionally breaking the bordered-card pattern) */}
        <div className="text-left pt-6">
          <SectionHeader 
            icon={Clock} 
            title="Recent Ledger Entries" 
            description="Your latest recorded transactions." 
          />
          
          {recentTransactions.length === 0 ? (
            <div className="py-8 border-b border-slate-100">
              <p className="text-lg font-semibold text-[#0B192C] mb-1">No transactions recorded yet</p>
              <p className="text-base text-slate-500">Add entries via the Voice Ledger to see them here.</p>
            </div>
          ) : (
            <div className="flex flex-col mt-4">
              {recentTransactions.map((t, index) => {
                const dateStr = t.createdAt 
                  ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Date N/A";

                return (
                  <div key={t.id} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 gap-4 ${
                    index !== recentTransactions.length - 1 ? "border-b border-slate-100" : ""
                  }`}>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-[#0B192C] mb-1">
                        {t.description}
                      </p>
                      <p className="text-base text-slate-500">{dateStr}</p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <span className={`text-2xl font-bold tracking-tight ${
                        t.type === "income" ? "text-[#0B192C]" : "text-[#B85042]"
                      }`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                      </span>
                      <span className={`inline-block text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-md ${
                        t.type === "income" 
                          ? "bg-slate-100 text-[#0B192C]" 
                          : "bg-[#B85042]/10 text-[#B85042]"
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
  );
}

