import { useState } from "react";
import SchemeForm from "./components/SchemeForm";
import ResultsList from "./components/ResultsList";
import VoiceLedger from "./components/VoiceLedger";

/* ══════════════════════════════════════════════════════
   NariSetu — Main Application Shell
   ══════════════════════════════════════════════════════ */

const API_URL = "https://narisetu-j9ac.onrender.com/api/schemes/match";

export default function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setIsLoading(true);
    setResults(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({
        success: false,
        error: "Network error — is the backend running on port 3000?",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-50/50">
      {/* ── Navigation Bar ──────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-navy-100/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 shadow-md shadow-navy-600/25">
              <span className="text-lg font-black text-white leading-none">N</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-navy-800">
                Nari<span className="text-saffron-500">Setu</span>
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-navy-400 -mt-0.5">
                Women Empowerment Platform
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-success-500/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
            </span>
            <span className="text-xs font-semibold text-success-600">
              Engine Online
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-saffron-400/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-navy-400/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-saffron-500/10 px-4 py-1.5 text-xs font-bold text-saffron-500 ring-1 ring-saffron-500/20 mb-5">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" />
            </svg>
            Government Scheme Eligibility Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy-800 sm:text-4xl">
            Discover Schemes You're{" "}
            <span className="bg-gradient-to-r from-saffron-500 to-saffron-400 bg-clip-text text-transparent">
              Eligible
            </span>{" "}
            For
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-navy-400">
            Our AI-powered two-pass engine evaluates your profile against
            hundreds of central and state government schemes to find the best
            matches — in seconds.
          </p>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-3xl border border-navy-100/80 bg-white/90 backdrop-blur-md p-7 shadow-xl shadow-navy-500/5">
              <SchemeForm onSubmit={handleSubmit} isLoading={isLoading} />
              <VoiceLedger />
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3">
            {!results && !isLoading ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-navy-100 py-28 text-center" id="empty-state">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-navy-50">
                  <svg className="h-10 w-10 text-navy-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy-600">
                  Your Results Will Appear Here
                </h3>
                <p className="mt-2 max-w-sm text-sm text-navy-300">
                  Fill in the eligibility form on the left and click{" "}
                  <strong className="text-navy-500">"Find Eligible Schemes"</strong> to
                  see matching government schemes.
                </p>
              </div>
            ) : (
              <ResultsList data={results} isLoading={isLoading} />
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-navy-100/60 bg-white/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center">
          <p className="text-xs text-navy-400">
            <span className="font-bold text-navy-500">NariSetu</span> — Built
            with 🤍 for Women Empowerment •{" "}
            <span className="text-navy-300">
              Eligibility Engine v1.0 • {new Date().getFullYear()}
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
