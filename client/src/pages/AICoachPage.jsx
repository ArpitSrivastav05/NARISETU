import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I can review your business activity, suggest smarter habits, and help with a monthly savings target.",
  },
];

export default function AICoachPage() {
  const { authHeaders } = useAuth();
  const [summary, setSummary] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [goal, setGoal] = useState("");
  const [goalError, setGoalError] = useState("");

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/ai/summary`, { headers });
      const result = await res.json();
      if (result.success) {
        setSummary(result.data);
        if (result.data?.savingsGoal?.monthlySavingsGoal) {
          setGoal(String(result.data.savingsGoal.monthlySavingsGoal));
        }
      } else {
        setSummary(null);
      }
    } catch (error) {
      console.error(error);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const progressPercent = useMemo(() => summary?.savingsGoal?.progressPercent ?? 0, [summary]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;

    const userMessage = draft.trim();
    setMessages((current) => [...current, { role: "user", content: userMessage }]);
    setDraft("");
    setIsChatLoading(true);

    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: userMessage }),
      });
      const result = await res.json();
      if (result.success) {
        setMessages((current) => [...current, { role: "assistant", content: result.data.reply }]);
      } else {
        setMessages((current) => [...current, { role: "assistant", content: result.error || "I could not respond right now." }]);
      }
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: "The coach is temporarily unavailable. Please try again shortly." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSaveGoal = async (event) => {
    event.preventDefault();
    const parsedGoal = Number(goal);
    if (!Number.isFinite(parsedGoal) || parsedGoal < 0) {
      setGoalError("Enter a valid monthly savings target.");
      return;
    }

    setGoalError("");
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/ai/savings-goal`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ monthlySavingsGoal: parsedGoal }),
      });
      const result = await res.json();
      if (result.success) {
        setSummary((current) => current ? { ...current, savingsGoal: result.data.savingsGoal } : current);
      }
    } catch (error) {
      setGoalError("Your goal could not be saved. Please try again.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">🤖 AI Business Coach</h2>
          <p className="mt-1 text-sm text-slate-500">Personalized insights from your Firestore data, including your finances, products, and saved schemes.</p>
        </div>
        <button
          onClick={fetchSummary}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          🔄 Refresh Insights
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Preparing your coach summary…</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Monthly AI Summary</p>
                <p className="mt-2 text-sm text-slate-600">{summary?.summary || "No summary is available yet."}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 px-3 py-2 text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Health Score</p>
                <p className="text-xl font-bold text-slate-800">{summary?.financialHealth?.score ?? 0}/100</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {summary?.recommendations?.length ? (
                summary.recommendations.map((recommendation) => (
                  <div key={recommendation.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">{recommendation.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{recommendation.description}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                  Add a little more financial activity to unlock more tailored recommendations.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Savings Goal</p>
            <form onSubmit={handleSaveGoal} className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-slate-700" htmlFor="goal">
                Monthly target (₹)
              </label>
              <input
                id="goal"
                type="number"
                min="0"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500"
              />
              <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                Save Goal
              </button>
              {goalError ? <p className="text-sm text-rose-500">{goalError}</p> : null}
            </form>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">
                {summary?.savingsGoal?.remaining > 0
                  ? `₹${summary.savingsGoal.remaining.toLocaleString("en-IN")} left to reach your target.`
                  : "You have met your current target pace."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">💬 Ask your coach</h3>
          <p className="text-sm text-slate-500">Ask for help with cash flow, product planning, scheme strategy, or savings habits.</p>
        </div>

        <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "bg-blue-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}>
                {message.content}
              </div>
            </div>
          ))}
          {isChatLoading ? (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">Thinking…</div>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSend} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about your cash flow, savings, or scheme opportunities"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
