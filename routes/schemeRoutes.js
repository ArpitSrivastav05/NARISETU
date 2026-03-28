/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — API Route Definitions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const express = require("express");
const router = express.Router();

const { matchSchemes } = require("../controllers/schemeController");
const { validateUserPayload } = require("../middleware/validatePayload");

// ── POST /api/schemes/match ──────────────────────────────────
// Pipeline: validatePayload → matchSchemes
// The validation middleware runs first and either rejects with
// 400 or normalizes the payload and calls next().
router.post("/match", validateUserPayload, matchSchemes);

module.exports = router;
