/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Request Payload Validation Middleware
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 *  Validates the incoming user payload against the
 *  defined schema before it reaches the controller.
 *
 *  This catches malformed requests early, reducing
 *  unnecessary Firestore reads and algorithm runs.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ── Allowed enum values ──────────────────────────────────────
const VALID_GENDERS = ["male", "female", "other"];
const VALID_CASTES = ["sc", "st", "obc", "general"];
const VALID_EMPLOYMENT = ["salaried", "self_employed", "farmer", "unemployed", "student"];
const VALID_EDUCATION = ["none", "primary", "secondary", "higher_secondary", "graduate", "post_graduate"];
const VALID_MARITAL = ["single", "married", "widowed", "divorced"];
const VALID_RESIDENCE = ["rural", "urban"];

const VALID_STATES = [
  "andhra_pradesh", "arunachal_pradesh", "assam", "bihar", "chhattisgarh",
  "goa", "gujarat", "haryana", "himachal_pradesh", "jharkhand", "karnataka",
  "kerala", "madhya_pradesh", "maharashtra", "manipur", "meghalaya",
  "mizoram", "nagaland", "odisha", "punjab", "rajasthan", "sikkim",
  "tamil_nadu", "telangana", "tripura", "uttar_pradesh", "uttarakhand",
  "west_bengal", "delhi", "jammu_kashmir", "ladakh", "chandigarh",
  "puducherry", "andaman_nicobar", "dadra_nagar_haveli", "lakshadweep",
];

/**
 * Middleware: validateUserPayload
 *
 * Checks every required field in the request body.
 * Returns 400 with specific error messages on failure.
 */
function validateUserPayload(req, res, next) {
  const errors = [];
  const body = req.body;

  // Guard: body must exist and be an object
  if (!body || typeof body !== "object") {
    return res.status(400).json({
      success: false,
      error: "Request body must be a valid JSON object.",
    });
  }

  // ── Required string fields ────────────────────────────────
  // name
  if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 100) {
    errors.push("'name' is required (string, 2–100 characters).");
  }

  // gender
  if (!body.gender || !VALID_GENDERS.includes(body.gender.toLowerCase())) {
    errors.push(`'gender' must be one of: ${VALID_GENDERS.join(", ")}.`);
  }

  // state
  if (!body.state || !VALID_STATES.includes(body.state.toLowerCase())) {
    errors.push(`'state' must be a valid Indian state/UT (lowercase, underscored). Example: "rajasthan", "uttar_pradesh".`);
  }

  // caste_category
  if (!body.caste_category || !VALID_CASTES.includes(body.caste_category.toLowerCase())) {
    errors.push(`'caste_category' must be one of: ${VALID_CASTES.join(", ")}.`);
  }

  // employment_type
  if (!body.employment_type || !VALID_EMPLOYMENT.includes(body.employment_type.toLowerCase())) {
    errors.push(`'employment_type' must be one of: ${VALID_EMPLOYMENT.join(", ")}.`);
  }

  // education_level
  if (!body.education_level || !VALID_EDUCATION.includes(body.education_level.toLowerCase())) {
    errors.push(`'education_level' must be one of: ${VALID_EDUCATION.join(", ")}.`);
  }

  // residence_type
  if (!body.residence_type || !VALID_RESIDENCE.includes(body.residence_type.toLowerCase())) {
    errors.push(`'residence_type' must be one of: ${VALID_RESIDENCE.join(", ")}.`);
  }

  // ── Required numeric fields ───────────────────────────────
  // age
  if (body.age === undefined || typeof body.age !== "number" || !Number.isInteger(body.age) || body.age < 0 || body.age > 120) {
    errors.push("'age' is required (integer, 0–120).");
  }

  // annual_income
  if (body.annual_income === undefined || typeof body.annual_income !== "number" || body.annual_income < 0) {
    errors.push("'annual_income' is required (number, ≥ 0).");
  }

  // ── Required boolean fields ───────────────────────────────
  // disability_status
  if (typeof body.disability_status !== "boolean") {
    errors.push("'disability_status' is required (boolean: true/false).");
  }

  // is_bpl
  if (typeof body.is_bpl !== "boolean") {
    errors.push("'is_bpl' is required (boolean: true/false).");
  }

  // ── Optional validated fields ─────────────────────────────
  // marital_status (optional, but if provided must be valid)
  if (body.marital_status && !VALID_MARITAL.includes(body.marital_status.toLowerCase())) {
    errors.push(`'marital_status' (if provided) must be one of: ${VALID_MARITAL.join(", ")}.`);
  }

  // business_category (optional, free-text — no enum validation, just type check)
  if (body.business_category && typeof body.business_category !== "string") {
    errors.push("'business_category' (if provided) must be a string.");
  }

  // ── Return errors or proceed ──────────────────────────────
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed. See details below.",
      validation_errors: errors,
    });
  }

  // Normalize casing on the payload so downstream logic
  // doesn't need to worry about case sensitivity
  req.body.gender = body.gender.toLowerCase();
  req.body.state = body.state.toLowerCase();
  req.body.caste_category = body.caste_category.toLowerCase();
  req.body.employment_type = body.employment_type.toLowerCase();
  req.body.education_level = body.education_level.toLowerCase();
  req.body.residence_type = body.residence_type.toLowerCase();
  if (body.marital_status) req.body.marital_status = body.marital_status.toLowerCase();
  if (body.business_category) req.body.business_category = body.business_category.toLowerCase();

  next(); // ✅ Payload is valid — proceed to controller
}

module.exports = { validateUserPayload };
