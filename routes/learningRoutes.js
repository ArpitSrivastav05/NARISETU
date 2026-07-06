const express = require("express");
const router = express.Router();
const learningController = require("../controllers/learningController");
const authMiddleware = require("../middleware/authMiddleware");

// All learning routes should be protected by authentication
router.use(authMiddleware);

// Get course catalog and recommendations
router.get("/courses", learningController.getCourses);

// Get user progress
router.get("/progress", learningController.getProgress);

// Update user progress (lesson completion, quiz score)
router.post("/progress", learningController.updateProgress);

// Ask the AI Tutor
router.post("/tutor", learningController.askAITutor);

module.exports = router;
