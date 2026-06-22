const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const businessController = require("../controllers/businessController");

// GET /api/business/mine — get authenticated user's business profile
router.get("/mine", verifyToken, businessController.getMyBusiness);

// POST /api/business/create
router.post("/create", verifyToken, businessController.createBusiness);

// GET /api/business/:id
router.get("/:id", businessController.getBusiness);

module.exports = router;
