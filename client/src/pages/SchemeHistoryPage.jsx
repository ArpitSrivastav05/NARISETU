import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import ResultsList from "../components/ResultsList";
import { ClipboardList, Bookmark, FileSearch, RefreshCw } from "lucide-react";

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
      {/* Header — hero element */}
      <div className="rounded-[2rem] bg-[#0B192C] p-8 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
            <ClipboardList className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Scheme Workspace</h2>
            <p className="text-slate-300 mt-1 text-base">
              Manage your saved schemes and review past eligibility searches.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          className={`py-3 px-6 text-base font-bold border-b-2 transition-colors min-h-[48px] ${
            activeTab === "saved"
              ? "border-[#B85042] text-[#B85042]"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved Schemes ({savedSchemes.length})
        </button>
        <button
          className={`py-3 px-6 text-base font-bold border-b-2 transition-colors min-h-[48px] ${
            activeTab === "history"
              ? "border-[#B85042] text-[#B85042]"
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
          <RefreshCw className="h-10 w-10 text-[#B85042] animate-spin mx-auto" />
          <p className="text-base text-slate-500 mt-4 font-semibold">Loading your workspace…</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="text-red-700 font-bold text-base">Failed to load workspace data</p>
          <p className="text-base text-red-500 mt-1">{error}</p>
        </div>
      ) : (
        <div className="pt-2">
          {activeTab === "saved" ? (
            savedSchemes.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#B85042]/10">
                  <Bookmark className="h-8 w-8 text-[#B85042]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[#0B192C] font-bold mt-4 text-lg">No Saved Schemes</h3>
                <p className="text-base text-slate-500 mt-2 max-w-sm mx-auto">
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
              <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#B85042]/10">
                  <FileSearch className="h-8 w-8 text-[#B85042]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[#0B192C] font-bold mt-4 text-lg">No Search History</h3>
                <p className="text-base text-slate-500 mt-2 max-w-sm mx-auto">
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
                      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-400 font-semibold">{dateStr}</p>
                          <h3 className="font-bold text-[#0B192C] mt-1 text-base">
                            {item.matchCount} scheme{item.matchCount !== 1 ? "s" : ""} matched
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(item.topSchemeNames || []).slice(0, 3).map((name, i) => (
                            <span
                              key={i}
                              className="text-xs font-semibold bg-[#B85042]/10 text-[#B85042] px-2.5 py-1 rounded-full"
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
                              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                              <p className="text-sm font-bold text-[#0B192C] mt-0.5 capitalize">{value}</p>
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
