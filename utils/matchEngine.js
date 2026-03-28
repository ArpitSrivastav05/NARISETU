/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Two-Pass Eligibility Match Engine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 *  This module contains the CORE matching algorithm for NariSetu.
 *  It is intentionally decoupled from Express and Firestore so it
 *  can be unit-tested with plain JavaScript objects.
 *
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │                  ALGORITHM OVERVIEW                        │
 *  │                                                             │
 *  │  The engine uses a TWO-PASS architecture:                   │
 *  │                                                             │
 *  │  PASS 1 — "The Gatekeeper" (Strict Filters)                │
 *  │    Hard boolean checks on mandatory criteria.               │
 *  │    If ANY strict filter fails → scheme is DROPPED (score=0) │
 *  │    This is a fast pre-filter that eliminates ineligible     │
 *  │    schemes before the expensive scoring pass.               │
 *  │                                                             │
 *  │  PASS 2 — "The Ranker" (Weighted Soft Scoring)              │
 *  │    For surviving schemes, each remaining criterion is       │
 *  │    evaluated and contributes its weight to the final score. │
 *  │    The result is a 0–100% Eligibility Match Score.          │
 *  │                                                             │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  ╔═════════════════════════════════════════════════════════════╗
 *  ║  TIME COMPLEXITY ANALYSIS                                  ║
 *  ║                                                             ║
 *  ║  Let S = total number of schemes in Firestore               ║
 *  ║  Let C = number of eligibility criteria (fixed ≈ 12)        ║
 *  ║  Let K = number of results to return (fixed = 5)            ║
 *  ║                                                             ║
 *  ║  Pass 1:  O(S × G)  where G = strict criteria (4)          ║
 *  ║           → O(S) since G is constant                        ║
 *  ║                                                             ║
 *  ║  Pass 2:  O(P × R)  where P = schemes passing Pass 1       ║
 *  ║                            R = soft criteria (8)            ║
 *  ║           → O(P) since R is constant                        ║
 *  ║           → O(S) worst case (all schemes pass Pass 1)       ║
 *  ║                                                             ║
 *  ║  Sort:    O(P log P) for sorting scored schemes             ║
 *  ║           → O(S log S) worst case                           ║
 *  ║                                                             ║
 *  ║  Slice:   O(K) = O(1) since K=5 is constant                ║
 *  ║                                                             ║
 *  ║  TOTAL:   O(S log S)                                        ║
 *  ║                                                             ║
 *  ║  In practice, Pass 1 aggressively prunes the dataset,       ║
 *  ║  so P << S, making the effective runtime closer to O(S).    ║
 *  ║  The constant factors are very small (array .includes()     ║
 *  ║  on arrays of 3-5 elements = effectively O(1)).             ║
 *  ╚═════════════════════════════════════════════════════════════╝
 */

// ──────────────────────────────────────────────────────────────
//  SOFT CRITERIA WEIGHT MAP
// ──────────────────────────────────────────────────────────────
// These weights determine how much each "soft" criterion
// contributes to the final eligibility score.
// Total soft weights = 100 (the score is already a percentage).
//
// NOTE: The 4 strict criteria (state, gender, max_income, is_bpl)
// do NOT carry weights — they are pass/fail gatekeepers.
// If a user matches ALL strict criteria, they start at a baseline,
// and soft criteria determine the final ranking.
// ──────────────────────────────────────────────────────────────

const SOFT_WEIGHTS = {
  age_range:          25,   // Age bracket match (min_age ≤ user ≤ max_age)
  caste_category:     20,   // Social category alignment
  employment_type:    20,   // Employment status match
  business_category:  15,   // Sector/industry relevance
  education_level:    10,   // Educational qualification match
  marital_status:      5,   // Marital status filter
  disability_status:   3,   // PWD-specific scheme check
  residence_type:      2,   // Rural/urban targeting
};

// Pre-compute total weight for percentage normalization
// This lets us add/remove criteria without changing scoring logic
const TOTAL_SOFT_WEIGHT = Object.values(SOFT_WEIGHTS).reduce((sum, w) => sum + w, 0);
// → Currently 100, but computed dynamically for maintainability


// ══════════════════════════════════════════════════════════════
//  PASS 1 — THE GATEKEEPER (Strict Boolean Filters)
// ══════════════════════════════════════════════════════════════
//
//  These are HARD eligibility requirements. If the user fails
//  even ONE of these checks for a scheme, the scheme is
//  immediately discarded. There is no partial credit.
//
//  Strict Criteria:
//    1. state       — User's state must be in scheme's state list (or "all")
//    2. gender      — User's gender must be in scheme's gender list (or "all")
//    3. max_income  — User's annual income must be ≤ scheme's ceiling
//    4. is_bpl      — If scheme requires BPL, user must be BPL
//
//  Time Complexity: O(1) per scheme
//    - Array.includes() on arrays of ≤ 36 elements (states) = O(1) amortized
//    - Numeric comparisons = O(1)
//
//  @param {Object} user    - The validated user payload
//  @param {Object} criteria - The scheme's eligibility_criteria object
//  @returns {boolean}       - true if scheme passes ALL strict filters
// ══════════════════════════════════════════════════════════════

function passesStrictFilters(user, criteria) {
  // ── 1. STATE CHECK ─────────────────────────────────────────
  // Many central schemes use ["all"] to indicate nationwide eligibility.
  // State-specific schemes list explicit state names in lowercase.
  if (
    !criteria.state.includes("all") &&
    !criteria.state.includes(user.state.toLowerCase())
  ) {
    return false; // User's state is not eligible → GATE CLOSED
  }

  // ── 2. GENDER CHECK ────────────────────────────────────────
  // Schemes for women empowerment will have ["female"].
  // Gender-neutral schemes use ["all"].
  if (
    !criteria.gender.includes("all") &&
    !criteria.gender.includes(user.gender.toLowerCase())
  ) {
    return false; // User's gender doesn't match → GATE CLOSED
  }

  // ── 3. INCOME CEILING CHECK ────────────────────────────────
  // If the scheme defines a max_income, the user's annual income
  // must not exceed it. Schemes without an income cap will have
  // max_income set to null/undefined or a very high sentinel value.
  if (
    criteria.max_income !== null &&
    criteria.max_income !== undefined &&
    user.annual_income > criteria.max_income
  ) {
    return false; // User earns too much → GATE CLOSED
  }

  // ── 4. BPL (Below Poverty Line) CHECK ──────────────────────
  // If a scheme explicitly requires BPL status (is_bpl === true),
  // the user must also be BPL. If the scheme doesn't require BPL
  // (is_bpl === false), anyone can apply.
  if (criteria.is_bpl === true && user.is_bpl !== true) {
    return false; // Scheme is BPL-only, user is not BPL → GATE CLOSED
  }

  // ── ALL GATES PASSED ──────────────────────────────────────
  return true;
}


// ══════════════════════════════════════════════════════════════
//  PASS 2 — THE RANKER (Weighted Soft Scoring)
// ══════════════════════════════════════════════════════════════
//
//  For each scheme that survived Pass 1, we evaluate the
//  remaining "soft" criteria. Each criterion that matches
//  adds its weight to the score. The final score is normalized
//  to a 0–100% scale.
//
//  This produces a granular ranking so users see the MOST
//  relevant schemes first, not just "eligible / not eligible."
//
//  Time Complexity: O(1) per scheme
//    - Fixed number of soft criteria (8)
//    - Each check is O(1) (includes() on small arrays, comparisons)
//
//  @param {Object} user     - The validated user payload
//  @param {Object} criteria - The scheme's eligibility_criteria object
//  @returns {{ score: number, matched: string[], unmatched: string[] }}
// ══════════════════════════════════════════════════════════════

function calculateSoftScore(user, criteria) {
  let earnedWeight = 0;
  const matched = [];    // Criteria the user matched (for transparency)
  const unmatched = [];  // Criteria the user didn't match

  // ── 1. AGE RANGE CHECK (Weight: 25) ────────────────────────
  // Check if user's age falls within [min_age, max_age].
  // If the scheme doesn't define age bounds, treat as a match
  // (no restriction = everyone qualifies).
  const ageMin = criteria.min_age ?? 0;
  const ageMax = criteria.max_age ?? 120;

  if (user.age >= ageMin && user.age <= ageMax) {
    earnedWeight += SOFT_WEIGHTS.age_range;
    matched.push("age");
  } else {
    unmatched.push("age");
  }

  // ── 2. CASTE CATEGORY CHECK (Weight: 20) ───────────────────
  // Schemes may target specific social categories (SC, ST, OBC)
  // or be open to all with ["general", "sc", "st", "obc"].
  if (
    Array.isArray(criteria.caste_category) &&
    criteria.caste_category.includes(user.caste_category.toLowerCase())
  ) {
    earnedWeight += SOFT_WEIGHTS.caste_category;
    matched.push("caste_category");
  } else {
    unmatched.push("caste_category");
  }

  // ── 3. EMPLOYMENT TYPE CHECK (Weight: 20) ──────────────────
  // Match user's employment status against scheme's eligible types.
  if (
    Array.isArray(criteria.employment_type) &&
    criteria.employment_type.includes(user.employment_type.toLowerCase())
  ) {
    earnedWeight += SOFT_WEIGHTS.employment_type;
    matched.push("employment_type");
  } else {
    unmatched.push("employment_type");
  }

  // ── 4. BUSINESS CATEGORY CHECK (Weight: 15) ────────────────
  // This is an optional field. If the user didn't provide a
  // business_category, we skip (no penalty). If the scheme
  // doesn't restrict by business category, full marks.
  if (!criteria.business_category || !Array.isArray(criteria.business_category) || criteria.business_category.length === 0) {
    // Scheme doesn't filter by business category → automatic match
    earnedWeight += SOFT_WEIGHTS.business_category;
    matched.push("business_category");
  } else if (user.business_category && criteria.business_category.includes(user.business_category.toLowerCase())) {
    earnedWeight += SOFT_WEIGHTS.business_category;
    matched.push("business_category");
  } else if (!user.business_category) {
    // User didn't provide business category, and scheme requires one.
    // Treat as a soft miss — don't add weight, but don't penalize harshly.
    unmatched.push("business_category");
  } else {
    unmatched.push("business_category");
  }

  // ── 5. EDUCATION LEVEL CHECK (Weight: 10) ──────────────────
  // Match user's education level against scheme's eligible levels.
  if (
    Array.isArray(criteria.education_level) &&
    criteria.education_level.includes(user.education_level.toLowerCase())
  ) {
    earnedWeight += SOFT_WEIGHTS.education_level;
    matched.push("education_level");
  } else {
    unmatched.push("education_level");
  }

  // ── 6. MARITAL STATUS CHECK (Weight: 5) ────────────────────
  // Some schemes target widowed women or single mothers.
  // ["all"] means marital status is not a filter.
  if (
    !criteria.marital_status ||
    !Array.isArray(criteria.marital_status) ||
    criteria.marital_status.includes("all")
  ) {
    // No restriction on marital status → automatic match
    earnedWeight += SOFT_WEIGHTS.marital_status;
    matched.push("marital_status");
  } else if (user.marital_status && criteria.marital_status.includes(user.marital_status.toLowerCase())) {
    earnedWeight += SOFT_WEIGHTS.marital_status;
    matched.push("marital_status");
  } else {
    unmatched.push("marital_status");
  }

  // ── 7. DISABILITY STATUS CHECK (Weight: 3) ─────────────────
  // If scheme targets PWD (disability_status = true),
  // only disabled users get the weight. If scheme doesn't
  // require disability (false), everyone passes.
  if (criteria.disability_status === true) {
    if (user.disability_status === true) {
      earnedWeight += SOFT_WEIGHTS.disability_status;
      matched.push("disability_status");
    } else {
      unmatched.push("disability_status");
    }
  } else {
    // Scheme is open to all (disability not required)
    earnedWeight += SOFT_WEIGHTS.disability_status;
    matched.push("disability_status");
  }

  // ── 8. RESIDENCE TYPE CHECK (Weight: 2) ────────────────────
  // Rural vs urban targeting. "all" means no restriction.
  if (
    !criteria.residence_type ||
    criteria.residence_type === "all" ||
    criteria.residence_type === user.residence_type.toLowerCase()
  ) {
    earnedWeight += SOFT_WEIGHTS.residence_type;
    matched.push("residence_type");
  } else {
    unmatched.push("residence_type");
  }

  // ── NORMALIZE TO 0–100% ────────────────────────────────────
  // score = (earnedWeight / TOTAL_SOFT_WEIGHT) × 100
  // This ensures the score always represents a percentage,
  // even if we add/remove criteria in the future.
  const score = Math.round((earnedWeight / TOTAL_SOFT_WEIGHT) * 100);

  return { score, matched, unmatched };
}


// ══════════════════════════════════════════════════════════════
//  MAIN ENTRY POINT — runMatchEngine()
// ══════════════════════════════════════════════════════════════
//
//  Orchestrates the full Two-Pass pipeline:
//
//  1. Iterate through all schemes
//  2. Pass 1: Filter with strict criteria
//  3. Pass 2: Score survivors with soft criteria
//  4. Sort by score (descending)
//  5. Return top K results (default K=5)
//
//  ┌──────────────────────────────────────────────────────────┐
//  │  OVERALL TIME COMPLEXITY                                 │
//  │                                                          │
//  │  Step 1: O(S)       — iterate all schemes                │
//  │  Step 2: O(S × 4)   — 4 strict checks per scheme = O(S) │
//  │  Step 3: O(P × 8)   — 8 soft checks per survivor = O(P) │
//  │  Step 4: O(P log P) — sort survivors by score            │
//  │  Step 5: O(K)       — slice top 5 = O(1)                │
//  │                                                          │
//  │  Total: O(S + P log P)                                   │
//  │  Worst case (P = S): O(S log S)                          │
//  │  Best case (aggressive pruning): O(S)                    │
//  │                                                          │
//  │  SPACE COMPLEXITY: O(P) for the scored results array     │
//  └──────────────────────────────────────────────────────────┘
//
//  @param {Object}   user     - Validated user payload
//  @param {Object[]} schemes  - Array of scheme documents from Firestore
//  @param {number}   [topK=5] - Number of top results to return
//  @returns {{ results: Object[], stats: Object }}
// ══════════════════════════════════════════════════════════════

function runMatchEngine(user, schemes, topK = 5) {
  const scoredResults = [];  // Accumulator for schemes that pass the gatekeeper

  // Tracking statistics for the response envelope
  let totalEvaluated = 0;
  let passedGatekeeper = 0;
  let droppedByGatekeeper = 0;

  // ── SINGLE ITERATION OVER ALL SCHEMES ──────────────────────
  // We combine Pass 1 and Pass 2 into a single loop for efficiency.
  // Instead of filtering into an intermediate array and then scoring
  // (two separate iterations), we check strict filters first and
  // immediately score survivors in the same iteration.
  //
  // This reduces the constant factor, though Big O remains the same.
  // Effective complexity of this loop: O(S × (G + R)) = O(S × 12) = O(S)

  for (const scheme of schemes) {
    totalEvaluated++;

    // Validate that scheme has the expected structure
    const criteria = scheme.eligibility_criteria;
    if (!criteria) {
      droppedByGatekeeper++;
      continue; // Malformed scheme document → skip silently
    }

    // ─────────────────────────────────────────────────────────
    //  PASS 1: THE GATEKEEPER
    //  Strict boolean filters — fail ANY = drop the scheme
    // ─────────────────────────────────────────────────────────
    if (!passesStrictFilters(user, criteria)) {
      droppedByGatekeeper++;
      continue; // ← Short-circuit: skip Pass 2 entirely for this scheme
    }

    // ─────────────────────────────────────────────────────────
    //  PASS 2: THE RANKER
    //  Weighted scoring on soft criteria
    // ─────────────────────────────────────────────────────────
    passedGatekeeper++;
    const { score, matched, unmatched } = calculateSoftScore(user, criteria);

    // Only include schemes with a meaningful score (> 0%)
    // A score of 0 means the user matched no soft criteria at all,
    // which is functionally ineligible even if strict criteria passed.
    if (score > 0) {
      scoredResults.push({
        scheme_id: scheme.scheme_id,
        scheme_name: scheme.scheme_name,
        description: scheme.description || "",
        ministry: scheme.ministry || "",
        match_score: score,
        matched_criteria: matched,
        unmatched_criteria: unmatched,
        benefits: scheme.benefits || {},
        scheme_url: scheme.scheme_url || "",
      });
    }
  }

  // ── SORT BY SCORE (DESCENDING) ─────────────────────────────
  // JavaScript's Array.sort() uses TimSort under the hood,
  // which gives us O(P log P) worst case and O(P) best case
  // (when the array is nearly sorted).
  //
  // For our use case P (survivors) is typically much smaller
  // than S (total schemes), making this step very fast.
  scoredResults.sort((a, b) => b.match_score - a.match_score);

  // ── SLICE TOP K RESULTS ────────────────────────────────────
  // O(K) = O(1) since K is a small constant (default 5).
  // We could use a min-heap for O(P log K) if P were huge,
  // but for government scheme databases (hundreds, not millions),
  // a full sort + slice is simpler and fast enough.
  const topResults = scoredResults.slice(0, topK);

  return {
    results: topResults,
    stats: {
      total_schemes_evaluated: totalEvaluated,
      passed_gatekeeper: passedGatekeeper,
      dropped_by_gatekeeper: droppedByGatekeeper,
      total_matches_found: scoredResults.length,
      results_returned: topResults.length,
    },
  };
}


// ── MODULE EXPORTS ───────────────────────────────────────────
module.exports = {
  runMatchEngine,
  passesStrictFilters,      // Exported for unit testing
  calculateSoftScore,       // Exported for unit testing
  SOFT_WEIGHTS,             // Exported for introspection/testing
  TOTAL_SOFT_WEIGHT,
};
