const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const userController = require("../controllers/userController");

// POST /api/user/sync — called on every login to create/update user doc
router.post("/sync", verifyToken, userController.syncUser);

// GET /api/user/profile — get authenticated user's Firestore profile
router.get("/profile", verifyToken, userController.getProfile);

// PUT /api/user/profile — update profile fields
router.put("/profile", verifyToken, userController.updateProfile);

module.exports = router;
