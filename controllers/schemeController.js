/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Scheme Controller
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 *  This controller orchestrates the interaction between
 *  the Express route layer, Firestore, and the matching
 *  engine. It follows the thin-controller pattern —
 *  business logic lives in utils/matchEngine.js.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const { db } = require("../config/firebase");
const { runMatchEngine } = require("../utils/matchEngine");

/**
 * matchSchemes — Core API handler
 *
 * Flow:
 *   1. Extract the validated user payload from req.body
 *   2. Query Firestore for all ACTIVE schemes
 *   3. Delegate to the Two-Pass Match Engine
 *   4. Return the ranked results in a structured envelope
 *
 * @route  POST /api/schemes/match
 * @access Public (add auth middleware in production)
 */
async function matchSchemes(req, res) {
  try {
    // Guard: Ensure Firebase is initialized
    if (!db) {
      return res.status(503).json({
        success: false,
        error: "Database not available. Firebase is not configured.",
        message: "Please add a valid serviceAccountKey.json to the project root.",
      });
    }

    const user = req.body;

    // ── Step 1: Fetch all active schemes from Firestore ──────
    // We use a simple .where() filter to only pull active schemes.
    // This reduces the dataset before it hits the algorithm.
    //
    // NOTE: For very large scheme databases (10,000+), consider
    // adding a Firestore composite index on (is_active + state)
    // and pre-filtering by state at the query level. For the
    // current Indian government scheme count (~500–1000), fetching
    // all active schemes is perfectly efficient.
    const schemesSnapshot = await db
      .collection("schemes")
      .where("metadata.is_active", "==", true)
      .get();

    // Handle empty database gracefully
    if (schemesSnapshot.empty) {
      return res.status(200).json({
        success: true,
        user: user.name,
        message: "No active schemes found in the database.",
        total_schemes_evaluated: 0,
        matches_found: 0,
        top_matches: [],
      });
    }

    // ── Step 2: Convert Firestore docs to plain objects ──────
    // Firestore QueryDocumentSnapshot objects need .data() to
    // extract the actual document fields. We also attach the
    // Firestore document ID for reference.
    const schemes = schemesSnapshot.docs.map((doc) => ({
      id: doc.id,          // Firestore auto-generated document ID
      ...doc.data(),       // Spread all scheme fields
    }));

    // ── Step 3: Run the Two-Pass Match Engine ────────────────
    // This is where the magic happens. The engine returns:
    //   - results: top K schemes with scores and criteria breakdown
    //   - stats: evaluation statistics for the response envelope
    const { results, stats } = runMatchEngine(user, schemes);

    // Save search history if user is authenticated
    if (req.user) {
      try {
        const historyRef = db
          .collection("users")
          .doc(req.user.uid)
          .collection("schemeSearchHistory")
          .doc();

        await historyRef.set({
          userId: req.user.uid,
          timestamp: new Date().toISOString(),
          formPayload: user,
          matchCount: stats.total_matches_found,
          topSchemeNames: results.slice(0, 3).map((r) => r.title || r.metadata?.title || r.name || "Scheme"),
        });

        // Store in global schemeMatches collection for audit and analytics
        const matchRef = db.collection("schemeMatches").doc();
        await matchRef.set({
          userId: req.user.uid,
          ownerId: req.user.uid,
          timestamp: new Date().toISOString(),
          formPayload: user,
          matchCount: stats.total_matches_found,
          topSchemeNames: results.slice(0, 3).map((r) => r.title || r.metadata?.title || r.name || "Scheme"),
        });
      } catch (historyErr) {
        console.error("Failed to save scheme search history or matches:", historyErr.message);
      }
    }

    // ── Step 4: Build and send the response ──────────────────
    return res.status(200).json({
      success: true,
      user: user.name,
      total_schemes_evaluated: stats.total_schemes_evaluated,
      passed_strict_filters: stats.passed_gatekeeper,
      dropped_by_strict_filters: stats.dropped_by_gatekeeper,
      matches_found: stats.total_matches_found,
      results_returned: stats.results_returned,
      top_matches: results,
    });

  } catch (error) {
    // ── Error handling ────────────────────────────────────────
    // Log the full error for server-side debugging, but send
    // a sanitized message to the client (no stack traces).
    console.error("❌ Error in matchSchemes:", error.message);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      error: "Internal server error while evaluating schemes.",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * GET /api/schemes/history
 * Returns search history for the authenticated user.
 */
async function getSchemeHistory(req, res) {
  try {
    const { uid } = req.user;
    const historySnapshot = await db
      .collection("users")
      .doc(uid)
      .collection("schemeSearchHistory")
      .orderBy("timestamp", "desc")
      .get();

    const history = [];
    historySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error in getSchemeHistory:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching history.",
      message: error.message,
    });
  }
}

/**
 * POST /api/schemes/bookmark
 * Bookmarks a scheme for the authenticated user.
 */
async function bookmarkScheme(req, res) {
  try {
    const { schemeId } = req.body;
    const { uid } = req.user;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        error: "Scheme ID is required.",
      });
    }

    // Verify scheme exists in 'schemes' collection
    const schemeDoc = await db.collection("schemes").doc(schemeId).get();
    if (!schemeDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Scheme not found.",
      });
    }

    const docId = `${uid}_${schemeId}`;
    const savedRef = db.collection("savedSchemes").doc(docId);
    const schemeData = schemeDoc.data();

    await savedRef.set({
      userId: uid,
      ownerId: uid,
      schemeId,
      scheme_name: schemeData.scheme_name || schemeData.name || "Scheme",
      description: schemeData.description || "",
      ministry: schemeData.ministry || "",
      benefits: schemeData.benefits || null,
      metadata: schemeData.metadata || null,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: "Scheme bookmarked successfully.",
    });
  } catch (error) {
    console.error("Error in bookmarkScheme:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
}

/**
 * DELETE /api/schemes/bookmark/:schemeId
 * Removes a bookmarked scheme for the authenticated user.
 */
async function unbookmarkScheme(req, res) {
  try {
    const { schemeId } = req.params;
    const { uid } = req.user;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        error: "Scheme ID is required.",
      });
    }

    const docId = `${uid}_${schemeId}`;
    const savedRef = db.collection("savedSchemes").doc(docId);
    const doc = await savedRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Bookmark not found.",
      });
    }

    await savedRef.delete();

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully.",
    });
  } catch (error) {
    console.error("Error in unbookmarkScheme:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
}

/**
 * GET /api/schemes/saved
 * Returns bookmarked schemes for the authenticated user.
 */
async function getSavedSchemes(req, res) {
  try {
    const { uid } = req.user;
    const snapshot = await db
      .collection("savedSchemes")
      .where("userId", "==", uid)
      .get();

    const saved = [];
    snapshot.forEach((doc) => {
      saved.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return res.status(200).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    console.error("Error in getSavedSchemes:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
}

module.exports = {
  matchSchemes,
  getSchemeHistory,
  bookmarkScheme,
  unbookmarkScheme,
  getSavedSchemes,
};
