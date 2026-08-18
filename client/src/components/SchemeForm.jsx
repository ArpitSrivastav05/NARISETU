import { useState } from "react";
import { UserSearch, User, MapPin, Briefcase, Settings, Search, Loader2, ChevronDown } from "lucide-react";

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
function FieldGroup({ label, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-base font-semibold text-[#0B192C]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-4 min-h-[48px] text-base text-[#0B192C] shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#B85042] focus:ring-2 focus:ring-[#B85042]/20 focus:outline-none";

const selectClasses =
  "w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 min-h-[48px] pr-10 text-base text-[#0B192C] shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-[#B85042] focus:ring-2 focus:ring-[#B85042]/20 focus:outline-none cursor-pointer";

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
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        strokeWidth={2}
      />
    </div>
  );

  // Section header component
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <h3 className="text-sm font-bold tracking-wide text-slate-500 uppercase">
        {title}
      </h3>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} id="eligibility-form" className="space-y-8">
      {/* ── Header ───────────────────────────────────── */}
      <div className="text-left">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
            <UserSearch className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="pt-0.5">
            <h2 className="text-2xl font-bold text-[#0B192C]">
              Check Your Eligibility
            </h2>
            <p className="mt-1.5 text-base text-slate-500">
              Fill in your details to discover government schemes tailored for you
            </p>
          </div>
        </div>
        <div className="text-left bg-[#B85042]/5 p-4 rounded-xl border border-[#B85042]/15">
          <h4 className="text-base font-bold text-[#0B192C] mb-1 flex items-center gap-2">
            <Settings className="h-4 w-4 text-[#B85042]" strokeWidth={2.5} /> How Scheme Matching Works
          </h4>
          <p className="text-base text-slate-600 leading-relaxed">
            Government schemes often have mandatory eligibility requirements such as gender, income, state, or age. Our Eligibility Engine follows official rules exactly. Women-specific schemes are only shown to eligible users. Open schemes are shown to everyone who qualifies.
          </p>
        </div>
      </div>

      {/* ── Personal Details Section ─────────────────── */}
      <div className="space-y-5">
        <SectionHeader icon={User} title="Personal Details" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldGroup label="Full Name" htmlFor="name">
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

          <FieldGroup label="Age" htmlFor="age">
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

          <FieldGroup label="Gender" htmlFor="gender">
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

          <FieldGroup label="Marital Status" htmlFor="marital_status">
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
        <SectionHeader icon={MapPin} title="Location & Social Category" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldGroup label="State / UT" htmlFor="state">
            <SelectField
              name="state"
              options={STATES}
              placeholder="Select your state"
              required
            />
          </FieldGroup>

          <FieldGroup label="Caste Category" htmlFor="caste_category">
            <SelectField
              name="caste_category"
              options={CASTES}
              placeholder="Select category"
              required
            />
          </FieldGroup>

          <FieldGroup label="Residence Type" htmlFor="residence_type">
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
        <SectionHeader icon={Briefcase} title="Financial & Employment" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldGroup label="Annual Income (₹)" htmlFor="annual_income">
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

          <FieldGroup label="Employment Type" htmlFor="employment_type">
            <SelectField
              name="employment_type"
              options={EMPLOYMENT_TYPES}
              placeholder="Select type"
              required
            />
          </FieldGroup>

          <FieldGroup label="Education Level" htmlFor="education_level">
            <SelectField
              name="education_level"
              options={EDUCATION_LEVELS}
              placeholder="Select level"
              required
            />
          </FieldGroup>

          <FieldGroup label="Business Category" htmlFor="business_category">
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
        <SectionHeader icon={Settings} title="Additional Information" />

        <div className="flex flex-wrap gap-6">
          {/* BPL toggle */}
          <label
            htmlFor="is_bpl"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 min-h-[48px] py-3.5 transition-all hover:border-slate-300 hover:bg-slate-100 select-none"
          >
            <input
              id="is_bpl"
              name="is_bpl"
              type="checkbox"
              checked={form.is_bpl}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded border-slate-300 text-[#B85042] focus:ring-[#B85042] accent-[#B85042]"
            />
            <div>
              <span className="text-base font-semibold text-[#0B192C]">
                Below Poverty Line (BPL)
              </span>
              <p className="text-sm text-slate-500">
                Do you hold a BPL card?
              </p>
            </div>
          </label>

          {/* Disability toggle */}
          <label
            htmlFor="disability_status"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 min-h-[48px] py-3.5 transition-all hover:border-slate-300 hover:bg-slate-100 select-none"
          >
            <input
              id="disability_status"
              name="disability_status"
              type="checkbox"
              checked={form.disability_status}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded border-slate-300 text-[#B85042] focus:ring-[#B85042] accent-[#B85042]"
            />
            <div>
              <span className="text-base font-semibold text-[#0B192C]">
                Person with Disability (PwD)
              </span>
              <p className="text-sm text-slate-500">
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
        className="w-full min-h-[48px] rounded-xl bg-[#B85042] hover:bg-[#9d4438] px-8 py-4 text-base font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
      >
        <span className="flex items-center justify-center gap-2.5">
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Searching Schemes…
            </>
          ) : (
            <>
              <Search className="h-5 w-5" strokeWidth={2.5} />
              Find Eligible Schemes
            </>
          )}
        </span>
      </button>
    </form>
  );
}
