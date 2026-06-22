const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/summary
router.get("/dashboard/summary", verifyToken, dashboardController.getSummary);

// GET /api/transactions
router.get("/transactions", verifyToken, dashboardController.getTransactions);

module.exports = router;
