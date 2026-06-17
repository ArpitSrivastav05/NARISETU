const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

// POST /api/business/create
router.post("/create", businessController.createBusiness);

// GET /api/business/:id
router.get("/:id", businessController.getBusiness);

module.exports = router;
