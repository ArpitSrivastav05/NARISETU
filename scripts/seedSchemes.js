/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Firestore Seed Script
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 *  Injects 5 realistic government scheme documents into the
 *  Firestore `schemes` collection. Run once to populate the
 *  database for testing.
 *
 *  Usage: node scripts/seedSchemes.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// ── Initialize Firebase Admin ────────────────────────────────
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "serviceAccountKey.json"), "utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ══════════════════════════════════════════════════════════════
//  5 REALISTIC GOVERNMENT SCHEMES
// ══════════════════════════════════════════════════════════════

const schemes = [
  // ── 1. PM-KISAN: Central, agriculture, income support ──────
  {
    scheme_id: "SCH_PM_KISAN_001",
    scheme_name: "PM-KISAN Samman Nidhi",
    description:
      "Provides income support of ₹6,000 per year in three equal installments to small and marginal farmer families with cultivable landholding. Aims to supplement financial needs for procuring inputs related to agriculture and allied activities.",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    scheme_url: "https://pmkisan.gov.in",

    eligibility_criteria: {
      gender: ["all"],
      min_age: 18,
      max_age: 65,
      caste_category: ["sc", "st", "obc", "general"],
      max_income: 200000,
      employment_type: ["farmer", "self_employed"],
      business_category: ["agriculture", "allied_agriculture"],
      education_level: ["none", "primary", "secondary", "higher_secondary", "graduate"],
      state: ["all"],
      marital_status: ["all"],
      disability_status: false,
      is_bpl: true,
      residence_type: "rural",
    },

    benefits: {
      type: "cash_transfer",
      amount: 6000,
      frequency: "annual",
      currency: "INR",
    },

    metadata: {
      is_active: true,
      launch_date: "2019-02-24",
      last_updated: "2026-01-15",
      tags: ["agriculture", "income_support", "central", "farmer"],
    },
  },

  // ── 2. PMMY (Mudra Yojana): Central, micro-enterprise loan ─
  {
    scheme_id: "SCH_MUDRA_002",
    scheme_name: "Pradhan Mantri Mudra Yojana (PMMY)",
    description:
      "Provides micro-loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. Loans are offered under three categories: Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh). Encourages entrepreneurship among women and SC/ST communities.",
    ministry: "Ministry of Finance",
    scheme_url: "https://www.mudra.org.in",

    eligibility_criteria: {
      gender: ["all"],
      min_age: 18,
      max_age: 55,
      caste_category: ["sc", "st", "obc", "general"],
      max_income: 500000,
      employment_type: ["self_employed", "unemployed"],
      business_category: ["handloom", "handicraft", "retail", "food_processing", "textile", "services"],
      education_level: ["none", "primary", "secondary", "higher_secondary", "graduate", "post_graduate"],
      state: ["all"],
      marital_status: ["all"],
      disability_status: false,
      is_bpl: false,
      residence_type: "all",
    },

    benefits: {
      type: "loan",
      amount: 1000000,
      frequency: "one_time",
      currency: "INR",
    },

    metadata: {
      is_active: true,
      launch_date: "2015-04-08",
      last_updated: "2026-02-20",
      tags: ["entrepreneurship", "micro_enterprise", "loan", "central"],
    },
  },

  // ── 3. UP Mission Shakti: State-specific, women only ───────
  {
    scheme_id: "SCH_UP_SHAKTI_003",
    scheme_name: "Mission Shakti — Uttar Pradesh Women Empowerment",
    description:
      "A flagship scheme of the Uttar Pradesh government that provides financial assistance, skill training, and self-employment opportunities to women across the state. Includes grants for setting up Self Help Groups (SHGs) and micro-enterprises in handloom, handicraft, and food processing sectors.",
    ministry: "UP Department of Women & Child Development",
    scheme_url: "https://missionshakti.up.gov.in",

    eligibility_criteria: {
      gender: ["female"],
      min_age: 18,
      max_age: 50,
      caste_category: ["sc", "st", "obc", "general"],
      max_income: 300000,
      employment_type: ["self_employed", "unemployed", "farmer"],
      business_category: ["handloom", "handicraft", "food_processing", "dairy", "textile"],
      education_level: ["none", "primary", "secondary", "higher_secondary", "graduate"],
      state: ["uttar_pradesh"],
      marital_status: ["all"],
      disability_status: false,
      is_bpl: false,
      residence_type: "all",
    },

    benefits: {
      type: "grant_and_training",
      amount: 50000,
      frequency: "one_time",
      currency: "INR",
    },

    metadata: {
      is_active: true,
      launch_date: "2020-10-17",
      last_updated: "2026-03-01",
      tags: ["women_empowerment", "state", "uttar_pradesh", "self_employment"],
    },
  },

  // ── 4. PM Kaushal Vikas Yojana: Student/youth skill scheme ─
  {
    scheme_id: "SCH_PMKVY_004",
    scheme_name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
    description:
      "India's largest skill certification scheme. Provides free short-term skill training and certification to youth, with a focus on industry-relevant skills. Trainees receive a government certificate and placement assistance upon course completion.",
    ministry: "Ministry of Skill Development & Entrepreneurship",
    scheme_url: "https://pmkvyofficial.org",

    eligibility_criteria: {
      gender: ["all"],
      min_age: 15,
      max_age: 35,
      caste_category: ["sc", "st", "obc", "general"],
      max_income: 800000,
      employment_type: ["student", "unemployed", "self_employed"],
      business_category: [],
      education_level: ["none", "primary", "secondary", "higher_secondary"],
      state: ["all"],
      marital_status: ["all"],
      disability_status: false,
      is_bpl: false,
      residence_type: "all",
    },

    benefits: {
      type: "training_and_certification",
      amount: 8000,
      frequency: "per_course",
      currency: "INR",
    },

    metadata: {
      is_active: true,
      launch_date: "2015-07-15",
      last_updated: "2026-01-30",
      tags: ["skill_development", "youth", "training", "central"],
    },
  },

  // ── 5. Mahila Samman Savings Certificate: Women, savings ───
  {
    scheme_id: "SCH_MSSC_005",
    scheme_name: "Mahila Samman Savings Certificate",
    description:
      "A one-time small savings scheme exclusively for women and girls. Offers a fixed interest rate of 7.5% per annum on deposits up to ₹2 lakh, with a maturity period of 2 years. Partial withdrawal facility available after 1 year.",
    ministry: "Ministry of Finance",
    scheme_url: "https://www.india.gov.in/mahila-samman-savings-certificate",

    eligibility_criteria: {
      gender: ["female"],
      min_age: 0,
      max_age: 120,
      caste_category: ["sc", "st", "obc", "general"],
      max_income: null,
      employment_type: ["salaried", "self_employed", "farmer", "unemployed", "student"],
      business_category: [],
      education_level: ["none", "primary", "secondary", "higher_secondary", "graduate", "post_graduate"],
      state: ["all"],
      marital_status: ["all"],
      disability_status: false,
      is_bpl: false,
      residence_type: "all",
    },

    benefits: {
      type: "savings_scheme",
      amount: 200000,
      frequency: "2_year_maturity",
      currency: "INR",
    },

    metadata: {
      is_active: true,
      launch_date: "2023-04-01",
      last_updated: "2026-03-10",
      tags: ["women", "savings", "financial_inclusion", "central"],
    },
  },
];

// ══════════════════════════════════════════════════════════════
//  SEED FUNCTION
// ══════════════════════════════════════════════════════════════

async function seedSchemes() {
  console.log("🌱 Starting Firestore seed...\n");

  const batch = db.batch();

  for (const scheme of schemes) {
    // Use the scheme_id as the document ID for deterministic seeding
    const docRef = db.collection("schemes").doc(scheme.scheme_id);
    batch.set(docRef, scheme, { merge: false });
    console.log(`   📄 Queued: ${scheme.scheme_name}`);
  }

  // Commit all writes in a single atomic batch
  await batch.commit();

  console.log(`\n✅ Successfully seeded ${schemes.length} schemes into Firestore.`);
  console.log("   Collection: schemes");
  console.log("   Documents:", schemes.map((s) => s.scheme_id).join(", "));
  process.exit(0);
}

// Run the seed
seedSchemes().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
