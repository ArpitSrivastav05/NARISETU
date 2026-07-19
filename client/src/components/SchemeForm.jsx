import { useState } from "react";

/* ══════════════════════════════════════════════════════
   NariSetu — Eligibility Form Component
   ══════════════════════════════════════════════════════ */

const STATES = [
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal_pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west_bengal", label: "West Bengal" },
  { value: "delhi", label: "Delhi" },
  { value: "jammu_kashmir", label: "Jammu & Kashmir" },
  { value: "ladakh", label: "Ladakh" },
  { value: "chandigarh", label: "Chandigarh" },
  { value: "puducherry", label: "Puducherry" },
  { value: "andaman_nicobar", label: "Andaman & Nicobar" },
  { value: "dadra_nagar_haveli", label: "Dadra & Nagar Haveli" },
  { value: "lakshadweep", label: "Lakshadweep" },
];



const CASTES = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
];

const EMPLOYMENT_TYPES = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self Employed" },
  { value: "farmer", label: "Farmer" },
  { value: "unemployed", label: "Unemployed" },
  { value: "student", label: "Student" },
];

const EDUCATION_LEVELS = [
  { value: "none", label: "No Formal Education" },
  { value: "primary", label: "Primary (1-5)" },
  { value: "secondary", label: "Secondary (6-10)" },
  { value: "higher_secondary", label: "Higher Secondary (11-12)" },
  { value: "graduate", label: "Graduate" },
  { value: "post_graduate", label: "Post Graduate" },
];

const MARITAL_STATUSES = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "divorced", label: "Divorced" },
];

const RESIDENCE_TYPES = [
  { value: "rural", label: "Rural" },
  { value: "urban", label: "Urban" },
];

const BUSINESS_CATEGORIES = [
  { value: "", label: "Not Applicable" },
  { value: "handloom", label: "Handloom & Textiles" },
  { value: "handicraft", label: "Handicraft" },
  { value: "food_processing", label: "Food Processing" },
  { value: "agriculture", label: "Agriculture" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Services" },
  { value: "technology", label: "Technology" },
];

// ── Reusable input field wrapper ─────────────────────────
function FieldGroup({ label, htmlFor, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-sm font-semibold text-navy-700"
      >
        <span className="text-base">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-800 shadow-sm transition-all duration-200 placeholder:text-navy-300 hover:border-navy-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 focus:outline-none";

const selectClasses =
  "w-full appearance-none rounded-xl border border-navy-200 bg-white px-4 py-3 pr-10 text-sm text-navy-800 shadow-sm transition-all duration-200 hover:border-navy-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 focus:outline-none cursor-pointer";

export default function SchemeForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    annual_income: "",
    state: "",
    gender: "",
    caste_category: "",
    employment_type: "",
    education_level: "",
    marital_status: "",
    residence_type: "",
    business_category: "",
    disability_status: false,
    is_bpl: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the payload matching the backend schema
    const payload = {
      name: form.name.trim() || "Anonymous User",
      age: parseInt(form.age, 10),
      annual_income: parseFloat(form.annual_income),
      state: form.state,
      gender: form.gender,
      caste_category: form.caste_category,
      employment_type: form.employment_type,
      education_level: form.education_level,
      residence_type: form.residence_type,
      disability_status: form.disability_status,
      is_bpl: form.is_bpl,
    };

    // Optional fields
    if (form.marital_status) payload.marital_status = form.marital_status;
    if (form.business_category)
      payload.business_category = form.business_category;

    onSubmit(payload);
  };

  // Select wrapper component with chevron icon
  const SelectField = ({ name, options, placeholder, ...rest }) => (
    <div className="relative">
      <select
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={selectClasses}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Chevron icon */}
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} id="eligibility-form" className="space-y-8">
      {/* ── Header ───────────────────────────────────── */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-500 to-navy-700 shadow-lg shadow-navy-500/30">
          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-navy-800">
          Check Your Eligibility
        </h2>
        <p className="mt-1.5 text-sm text-navy-400">
          Fill in your details to discover government schemes tailored for you
        </p>
        <div className="mt-3 text-left bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
            ℹ️ How Scheme Matching Works
          </h4>
          <p className="text-xs text-blue-800 leading-relaxed">
            Government schemes often have mandatory eligibility requirements such as gender, income, state, or age. Our Eligibility Engine follows official rules exactly. Women-specific schemes are only shown to eligible users. Open schemes are shown to everyone who qualifies.
          </p>
        </div>
      </div>

      {/* ── Personal Details Section ─────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-navy-100 pb-2">
          <span className="text-saffron-500 text-lg">👤</span>
          <h3 className="text-sm font-bold tracking-wide text-navy-600 uppercase">
            Personal Details
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldGroup label="Full Name" htmlFor="name" icon="✦">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className={inputClasses}
            />
          </FieldGroup>

          <FieldGroup label="Age" htmlFor="age" icon="🎂">
            <input
              id="age"
              name="age"
              type="number"
              min="0"
              max="120"
              placeholder="e.g. 28"
              value={form.age}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </FieldGroup>

          <FieldGroup label="Gender" htmlFor="gender" icon="🧑">
            <SelectField
              name="gender"
              options={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
                { value: "other", label: "Other" }
              ]}
              placeholder="Select gender"
              required
            />
          </FieldGroup>

          <FieldGroup label="Marital Status" htmlFor="marital_status" icon="💍">
            <SelectField
              name="marital_status"
              options={MARITAL_STATUSES}
              placeholder="Select status (optional)"
            />
          </FieldGroup>
        </div>
      </div>

      {/* ── Location & Social ────────────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-navy-100 pb-2">
          <span className="text-saffron-500 text-lg">📍</span>
          <h3 className="text-sm font-bold tracking-wide text-navy-600 uppercase">
            Location & Social Category
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldGroup label="State / UT" htmlFor="state" icon="🗺️">
            <SelectField
              name="state"
              options={STATES}
              placeholder="Select your state"
              required
            />
          </FieldGroup>

          <FieldGroup label="Caste Category" htmlFor="caste_category" icon="🏷️">
            <SelectField
              name="caste_category"
              options={CASTES}
              placeholder="Select category"
              required
            />
          </FieldGroup>

          <FieldGroup label="Residence Type" htmlFor="residence_type" icon="🏠">
            <SelectField
              name="residence_type"
              options={RESIDENCE_TYPES}
              placeholder="Rural or Urban"
              required
            />
          </FieldGroup>
        </div>
      </div>

      {/* ── Financial & Employment ───────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-navy-100 pb-2">
          <span className="text-saffron-500 text-lg">💼</span>
          <h3 className="text-sm font-bold tracking-wide text-navy-600 uppercase">
            Financial & Employment
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldGroup label="Annual Income (₹)" htmlFor="annual_income" icon="💰">
            <input
              id="annual_income"
              name="annual_income"
              type="number"
              min="0"
              placeholder="e.g. 250000"
              value={form.annual_income}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </FieldGroup>

          <FieldGroup label="Employment Type" htmlFor="employment_type" icon="🧑‍💻">
            <SelectField
              name="employment_type"
              options={EMPLOYMENT_TYPES}
              placeholder="Select type"
              required
            />
          </FieldGroup>

          <FieldGroup label="Education Level" htmlFor="education_level" icon="🎓">
            <SelectField
              name="education_level"
              options={EDUCATION_LEVELS}
              placeholder="Select level"
              required
            />
          </FieldGroup>

          <FieldGroup label="Business Category" htmlFor="business_category" icon="🏪">
            <SelectField
              name="business_category"
              options={BUSINESS_CATEGORIES}
              placeholder="Select if applicable"
            />
          </FieldGroup>
        </div>
      </div>

      {/* ── Toggles ──────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-navy-100 pb-2">
          <span className="text-saffron-500 text-lg">⚙️</span>
          <h3 className="text-sm font-bold tracking-wide text-navy-600 uppercase">
            Additional Information
          </h3>
        </div>

        <div className="flex flex-wrap gap-6">
          {/* BPL toggle */}
          <label
            htmlFor="is_bpl"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/50 px-5 py-3.5 transition-all hover:border-navy-200 hover:bg-navy-50 select-none"
          >
            <input
              id="is_bpl"
              name="is_bpl"
              type="checkbox"
              checked={form.is_bpl}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded border-navy-300 text-navy-600 focus:ring-navy-500 accent-navy-600"
            />
            <div>
              <span className="text-sm font-semibold text-navy-700">
                Below Poverty Line (BPL)
              </span>
              <p className="text-xs text-navy-400">
                Do you hold a BPL card?
              </p>
            </div>
          </label>

          {/* Disability toggle */}
          <label
            htmlFor="disability_status"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/50 px-5 py-3.5 transition-all hover:border-navy-200 hover:bg-navy-50 select-none"
          >
            <input
              id="disability_status"
              name="disability_status"
              type="checkbox"
              checked={form.disability_status}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded border-navy-300 text-navy-600 focus:ring-navy-500 accent-navy-600"
            />
            <div>
              <span className="text-sm font-semibold text-navy-700">
                Person with Disability (PwD)
              </span>
              <p className="text-xs text-navy-400">
                Do you have a disability certificate?
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* ── Submit Button ────────────────────────────── */}
      <button
        id="submit-btn"
        type="submit"
        disabled={isLoading}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-navy-600 to-navy-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-navy-600/30 transition-all duration-300 hover:from-navy-500 hover:to-navy-600 hover:shadow-xl hover:shadow-navy-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg cursor-pointer"
      >
        {/* Shimmer effect on hover */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative flex items-center justify-center gap-2.5">
          {isLoading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching Schemes…
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Find Eligible Schemes
            </>
          )}
        </span>
      </button>
    </form>
  );
}
