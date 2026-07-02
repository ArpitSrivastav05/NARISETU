import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import ResultsList from "../components/ResultsList";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

export default function SchemeHistoryPage() {
  const { authHeaders } = useAuth();
  const [activeTab, setActiveTab] = useState("saved"); // "saved" | "history"

  const [history, setHistory] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistoryAndSaved = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = await authHeaders();
      const [histRes, savedRes] = await Promise.all([
        fetch(`${API_URL}/api/schemes/history`, { headers }),
        fetch(`${API_URL}/api/schemes/saved`, { headers }),
      ]);

      if (!histRes.ok || !savedRes.ok) throw new Error("Failed to load data.");

      const histData = await histRes.json();
      const savedData = await savedRes.json();

      if (histData.success) setHistory(histData.data);
      if (savedData.success) setSavedSchemes(savedData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchHistoryAndSaved();
  }, [fetchHistoryAndSaved]);

  const handleToggleBookmark = async (schemeId) => {
    try {
      const headers = await authHeaders();
      const isAlreadySaved = savedSchemes.some((s) => s.schemeId === schemeId);

      if (isAlreadySaved) {
        await fetch(`${API_URL}/api/schemes/bookmark/${schemeId}`, {
          method: "DELETE",
          headers,
        });
      } else {
        await fetch(`${API_URL}/api/schemes/bookmark`, {
          method: "POST",
          headers,
          body: JSON.stringify({ schemeId }),
        });
      }
      await fetchHistoryAndSaved();
    } catch (err) {
      console.error("Bookmark toggle error:", err.message);
    }
  };

  const mockDataForResultsList = {
    success: true,
    results_returned: savedSchemes.length,
    total_schemes_evaluated: savedSchemes.length,
    passed_strict_filters: savedSchemes.length,
    matches_found: savedSchemes.length,
    top_matches: savedSchemes.map(s => ({
      ...s,
      scheme_id: s.schemeId,
      match_score: 100 // Or could be N/A, but keeping it numeric works better with ScoreBadge
    }))
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-800 to-navy-950 p-8 text-white shadow-xl">
        <h2 className="text-3xl font-extrabold tracking-tight">📋 Scheme Workspace</h2>
        <p className="text-slate-300 mt-2 text-sm">
          Manage your saved schemes and review past eligibility searches.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "saved"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved Schemes ({savedSchemes.length})
        </button>
        <button
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Search History ({history.length})
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 mt-4 font-semibold">Loading your workspace…</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold">Failed to load workspace data</p>
          <p className="text-xs text-rose-500 mt-1">{error}</p>
        </div>
      ) : (
        <div className="pt-2">
          {activeTab === "saved" ? (
            savedSchemes.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <span className="text-4xl">🔖</span>
                <h3 className="text-slate-700 font-bold mt-4">No Saved Schemes</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                  Bookmark schemes from the eligibility results to save them here for quick access later.
                </p>
              </div>
            ) : (
              <ResultsList
                data={mockDataForResultsList}
                isLoading={false}
                savedSchemes={savedSchemes}
                onToggleBookmark={handleToggleBookmark}
              />
            )
          ) : (
            history.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <span className="text-4xl">📄</span>
                <h3 className="text-slate-700 font-bold mt-4">No Search History</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                  Run the eligibility engine from the Schemes tab to see your search results saved here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => {
                  const dateStr = item.timestamp
                    ? new Date(item.timestamp).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })
                    : "Date N/A";

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-400 font-semibold">{dateStr}</p>
                          <h3 className="font-bold text-slate-800 mt-1">
                            {item.matchCount} scheme{item.matchCount !== 1 ? "s" : ""} matched
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(item.topSchemeNames || []).slice(0, 3).map((name, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Payload summary */}
                      {item.formPayload && (
                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: "State", value: item.formPayload.state?.replace(/_/g, " ") },
                            { label: "Age", value: item.formPayload.age },
                            { label: "Income", value: item.formPayload.annual_income ? `₹${Number(item.formPayload.annual_income).toLocaleString("en-IN")}` : null },
                            { label: "Category", value: item.formPayload.caste_category?.toUpperCase() },
                          ].filter(f => f.value).map(({ label, value }) => (
                            <div key={label}>
                              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                              <p className="text-xs font-bold text-slate-700 mt-0.5 capitalize">{value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
