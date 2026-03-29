/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Firebase Admin SDK Configuration
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 *  Initializes the Firebase Admin SDK using a service
 *  account key file located at the project root.
 *
 *  Exports a Firestore database instance (`db`) for
 *  use across controllers and utilities.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// ── Resolve the path to the service account key ──────────────
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, "..", "serviceAccountKey.json");

// ── Initialize the Firebase Admin app ────────────────────────
// Supports two modes:
//   1. FIREBASE_SERVICE_ACCOUNT env var (for Render / production)
//   2. Local serviceAccountKey.json file  (for local development)
let db = null;

if (!admin.apps.length) {
  try {
    let serviceAccount;

    // ── Priority 1: Environment variable (Render deployment) ──
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log("📦 Loading Firebase credentials from environment variable...");
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
    // ── Priority 2: Local JSON file (development) ─────────────
    else if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      console.log("📁 Loading Firebase credentials from serviceAccountKey.json...");
      const fileContent = fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf-8").trim();

      if (!fileContent) {
        throw new Error("serviceAccountKey.json is empty.");
      }

      serviceAccount = JSON.parse(fileContent);
    } else {
      throw new Error(
        "No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT env var or add serviceAccountKey.json."
      );
    }

    // Validate that it has the minimum required fields
    if (!serviceAccount.project_id || !serviceAccount.private_key) {
      throw new Error("Firebase credentials are missing required fields (project_id, private_key).");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log("✅ Firebase Admin SDK initialized successfully.");
    console.log(`   Project: ${serviceAccount.project_id}`);

  } catch (error) {
    console.warn("⚠️  Firebase initialization failed:", error.message);
    console.warn("   The server will start, but Firestore queries will fail.");
    console.warn("   Please add a valid serviceAccountKey.json to the project root.");
    console.warn("");

    // Initialize with a null db — the controller will handle this
    db = null;
  }
} else {
  db = admin.firestore();
}

module.exports = { admin, db };
