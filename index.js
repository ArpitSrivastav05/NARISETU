/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Express Server Entry Point
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 *  This is the main entry point for the NariSetu backend.
 *  It initializes Express, configures middleware, mounts
 *  API routes, and starts listening for connections.
 *
 *  Architecture:
 *    index.js → routes → middleware → controllers → matchEngine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ── Load environment variables FIRST ─────────────────────────
// dotenv must be required before any module that reads process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ── Import route modules ─────────────────────────────────────
const schemeRoutes = require("./routes/schemeRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const businessRoutes = require("./routes/businessRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// ── Initialize Express app ───────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════════════════════════════
//  MIDDLEWARE STACK
// ══════════════════════════════════════════════════════════════

// 1. CORS — Allow cross-origin requests (for frontend integration)
//    In production, replace '*' with your specific frontend domain.
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 2. JSON Body Parser — Parse incoming JSON payloads
//    Limit set to 1MB to prevent abuse.
app.use(express.json({ limit: "1mb" }));

// 3. Request Logger — Simple logging for development
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ══════════════════════════════════════════════════════════════
//  ROUTES
// ══════════════════════════════════════════════════════════════

// Health check endpoint — useful for uptime monitoring & load balancers
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "NariSetu Eligibility Engine",
    status: "operational",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Scheme matching routes — mounted at /api/schemes
// Full endpoint: POST /api/schemes/match
app.use("/api/schemes", schemeRoutes);

// Ledger voice routes — mounted at /api/ledger
app.use("/api/ledger", ledgerRoutes);

// Business routes — mounted at /api/business
app.use("/api/business", businessRoutes);

// Product routes — mounted at /api/products
app.use("/api/products", productRoutes);

// Dashboard & transaction routes — mounted at /api
app.use("/api", dashboardRoutes);

// ══════════════════════════════════════════════════════════════
//  404 HANDLER
// ══════════════════════════════════════════════════════════════

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found.",
    message: `No route matches ${req.method} ${req.originalUrl}`,
    available_endpoints: [
      "GET  /api/health",
      "POST /api/schemes/match",
      "POST /api/ledger/voice",
    ],
  });
});

// ══════════════════════════════════════════════════════════════
//  GLOBAL ERROR HANDLER
// ══════════════════════════════════════════════════════════════

app.use((err, req, res, next) => {
  console.error("💥 Unhandled error:", err.message);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: "An unexpected error occurred.",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ══════════════════════════════════════════════════════════════
//  START SERVER
// ══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🚀 NariSetu Eligibility Engine                  ║
  ║   🌐 Server running on http://localhost:${PORT}      ║
  ║   📡 POST /api/schemes/match                      ║
  ║   💚 GET  /api/health                              ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = app; // Export for testing
