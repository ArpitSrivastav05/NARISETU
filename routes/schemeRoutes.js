/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — API Route Definitions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const express = require("express");
const router = express.Router();

const {
  matchSchemes,
  getSchemeHistory,
  bookmarkScheme,
  unbookmarkScheme,
  getSavedSchemes,
} = require("../controllers/schemeController");
const { validateUserPayload } = require("../middleware/validatePayload");
const { verifyToken } = require("../middleware/verifyToken");

// POST /api/schemes/match — Protected route to match schemes and save results
router.post("/match", verifyToken, validateUserPayload, matchSchemes);

// GET /api/schemes/history — Get user's scheme search history
router.get("/history", verifyToken, getSchemeHistory);

// POST /api/schemes/bookmark — Bookmark a scheme
router.post("/bookmark", verifyToken, bookmarkScheme);

// DELETE /api/schemes/bookmark/:schemeId — Remove bookmark
router.delete("/bookmark/:schemeId", verifyToken, unbookmarkScheme);

// GET /api/schemes/saved — View bookmarked schemes
router.get("/saved", verifyToken, getSavedSchemes);

module.exports = router;
