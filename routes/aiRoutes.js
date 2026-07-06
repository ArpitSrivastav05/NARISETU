const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const aiController = require("../controllers/aiController");

router.post("/chat", verifyToken, aiController.chat);
router.get("/summary", verifyToken, aiController.getSummary);
router.get("/financial-health", verifyToken, aiController.getFinancialHealth);
router.put("/savings-goal", verifyToken, aiController.setSavingsGoal);
router.get("/intelligence-feed", verifyToken, aiController.getIntelligenceFeed);
router.post("/optimize-product", verifyToken, aiController.optimizeProduct);

module.exports = router;
