const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/summary
router.get("/dashboard/summary", dashboardController.getSummary);

// GET /api/transactions
router.get("/transactions", dashboardController.getTransactions);

module.exports = router;
