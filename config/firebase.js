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
// We guard against double-initialization and missing/empty key files
// so the server can boot gracefully during development setup.
let db = null;

if (!admin.apps.length) {
  try {
    // Check if the file exists and has content
    const fileContent = fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf-8").trim();

    if (!fileContent) {
      throw new Error("serviceAccountKey.json is empty.");
    }

    const serviceAccount = JSON.parse(fileContent);

    // Validate that it has the minimum required fields
    if (!serviceAccount.project_id || !serviceAccount.private_key) {
      throw new Error("serviceAccountKey.json is missing required fields (project_id, private_key).");
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
