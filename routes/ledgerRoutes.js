const express = require("express");
const multer = require("multer");
const { verifyToken } = require("../middleware/verifyToken");
const ledgerController = require("../controllers/ledgerController");

const router = express.Router();

// Configure multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to process voice transactions (protected)
router.post("/voice", verifyToken, upload.single("audio"), ledgerController.processVoiceTransaction);

module.exports = router;
