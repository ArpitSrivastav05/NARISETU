/* ══════════════════════════════════════════════════════
   NariSetu — Results List Component
   ══════════════════════════════════════════════════════ */
import React from 'react';
import { Target, ClipboardList, IndianRupee, Landmark, GraduationCap, PiggyBank, Award, CheckCircle2, AlertCircle, FileSearch, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

function ScoreBadge({ score }) {
  const isHigh = score >= 80;
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold shadow-sm ${
        isHigh
          ? "bg-success-500/10 text-success-600 ring-1 ring-success-500/20"
          : "bg-saffron-500/10 text-saffron-500 ring-1 ring-saffron-500/20"
      }`}
      title={`Match Score: ${score}%`}
    >
      {isHigh ? <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} /> : <AlertCircle className="h-4 w-4" strokeWidth={2.5} />}
      {score}% Match
    </div>
  );
}

function BenefitTag({ benefits }) {
  if (!benefits || !benefits.type) return null;

  const typeIcons = {
    cash_transfer: <IndianRupee className="h-3.5 w-3.5 mr-1" />,
    loan: <Landmark className="h-3.5 w-3.5 mr-1" />,
    grant_and_training: <GraduationCap className="h-3.5 w-3.5 mr-1" />,
    savings_scheme: <PiggyBank className="h-3.5 w-3.5 mr-1" />,
    training_and_certification: <Award className="h-3.5 w-3.5 mr-1" />,
  };
  const typeLabels = {
    cash_transfer: "Cash Transfer",
    loan: "Loan",
    grant_and_training: "Grant & Training",
    savings_scheme: "Savings Scheme",
    training_and_certification: "Training & Cert.",
  };

  const Icon = typeIcons[benefits.type] || <ClipboardList className="h-3.5 w-3.5 mr-1" />;
  const label = typeLabels[benefits.type] || benefits.type;
  const amount = benefits.amount
    ? `₹${benefits.amount.toLocaleString("en-IN")}`
    : null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="flex items-center rounded-lg bg-navy-50 px-2.5 py-1 font-medium text-navy-600 ring-1 ring-navy-100">
        {Icon} {label}
      </span>
      {amount && (
        <span className="rounded-lg bg-success-500/8 px-2.5 py-1 font-bold text-success-600 ring-1 ring-success-500/15">
          {amount}
        </span>
      )}
      {benefits.frequency && benefits.frequency !== "one_time" && (
        <span className="rounded-lg bg-saffron-500/8 px-2.5 py-1 font-medium text-saffron-500 ring-1 ring-saffron-400/15">
          {benefits.frequency.replace(/_/g, " ")}
        </span>
      )}
    </div>
  );
}

function SchemeCard({ scheme, index, isSaved, onToggleBookmark }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-navy-100/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-navy-500/8 hover:border-navy-200 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 80}ms` }}
      id={`scheme-card-${scheme.scheme_id}`}
    >
      {/* Top row: Ministry + Score */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="rounded-lg bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-500 ring-1 ring-navy-100">
          {scheme.ministry}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark && onToggleBookmark(scheme.scheme_id)}
            className={`p-1.5 rounded-full transition-colors ${
              isSaved
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            }`}
            title={isSaved ? "Remove from Saved" : "Save Scheme"}
          >
            {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
          <ScoreBadge score={scheme.match_score} />
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-bold leading-snug text-navy-800 group-hover:text-navy-600 transition-colors">
        {scheme.scheme_name}
      </h3>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-navy-400 line-clamp-3">
        {scheme.description}
      </p>

      {/* Benefits */}
      <BenefitTag benefits={scheme.benefits} />

      {/* Matched Criteria pills */}
      {scheme.matched_criteria && scheme.matched_criteria.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {scheme.matched_criteria.map((c) => (
            <span
              key={c}
              className="rounded-full bg-success-500/8 px-2 py-0.5 text-[11px] font-medium text-success-600"
            >
              ✓ {c.replace(/_/g, " ")}
            </span>
          ))}
          {scheme.unmatched_criteria?.map((c) => (
            <span
              key={c}
              className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-400"
            >
              ✗ {c.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      {/* Apply link */}
      {scheme.scheme_url && (
        <a
          href={scheme.scheme_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy-50 px-4 py-2 text-sm font-semibold text-navy-600 ring-1 ring-navy-100 transition-all hover:bg-navy-100 hover:text-navy-700"
        >
          Learn More
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
        </a>
      )}
    </div>
  );
}

export default function ResultsList({ data, isLoading, savedSchemes = [], onToggleBookmark }) {
  // ── Loading State ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20" id="loading-spinner">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-navy-100" />
          <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-navy-500" />
        </div>
        <p className="mt-5 text-sm font-semibold text-navy-500 animate-pulse">
          Evaluating schemes…
        </p>
        <p className="mt-1 text-xs text-navy-300">
          Our engine is matching your profile against government schemes
        </p>
      </div>
    );
  }

  // ── No data yet ────────────────────────────────────────
  if (!data) return null;

  // ── Error state ────────────────────────────────────────
  if (!data.success) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center" id="error-message">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-500" strokeWidth={2} />
        </div>
        <h3 className="font-bold text-red-700">Something went wrong</h3>
        <p className="mt-1 text-sm text-red-500">
          {data.error || "Unable to fetch results. Please try again."}
        </p>
        {data.validation_errors && (
          <ul className="mt-3 space-y-1 text-left text-sm text-red-600">
            {data.validation_errors.map((err, i) => (
              <li key={i} className="before:content-['•'] before:mr-2 before:text-red-400">
                {err}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // ── No matches ─────────────────────────────────────────
  if (!data.top_matches || data.top_matches.length === 0) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-navy-50/50 p-10 text-center" id="no-results">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-100">
          <FileSearch className="h-8 w-8 text-navy-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-navy-700">No Matching Schemes</h3>
        <p className="mt-2 text-sm text-navy-400 max-w-md mx-auto">
          We couldn't find any schemes matching your profile. Try adjusting your details — particularly income, state, or employment type.
        </p>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────
  return (
    <div className="space-y-6" id="results-list">
      {/* Summary header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
            <Target className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="text-left pt-0.5">
            <h2 className="text-2xl font-bold text-[#0B192C]">
              Eligible Schemes
            </h2>
            <p className="text-base text-slate-500 mt-1">
              Showing <span className="font-semibold text-navy-600">{data.results_returned}</span> of{" "}
              <span className="font-semibold text-navy-600">{data.total_schemes_evaluated}</span> schemes
              evaluated
            </p>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex gap-2">
          <span className="rounded-full bg-success-500/10 px-3 py-1 text-xs font-semibold text-success-600">
            {data.passed_strict_filters} passed filters
          </span>
          <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-500 ring-1 ring-navy-100">
            {data.matches_found} matches
          </span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
        {data.top_matches.map((scheme, index) => {
          const isSaved = savedSchemes.some((s) => s.schemeId === scheme.scheme_id);
          return (
            <SchemeCard
              key={scheme.scheme_id}
              scheme={scheme}
              index={index}
              isSaved={isSaved}
              onToggleBookmark={onToggleBookmark}
            />
          );
        })}
      </div>
    </div>
  );
}
