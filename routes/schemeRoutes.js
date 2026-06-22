/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — API Route Definitions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const express = require("express");
const router = express.Router();

const { matchSchemes, getSchemeHistory } = require("../controllers/schemeController");
const { validateUserPayload } = require("../middleware/validatePayload");
const { verifyToken, optionalToken } = require("../middleware/verifyToken");

// POST /api/schemes/match — Soft auth to optionally save match history
router.post("/match", optionalToken, validateUserPayload, matchSchemes);

// GET /api/schemes/history — Get user's scheme search history
router.get("/history", verifyToken, getSchemeHistory);

module.exports = router;
