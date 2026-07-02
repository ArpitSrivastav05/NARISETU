const { db, admin } = require("../config/firebase");

/**
 * POST /api/user/sync
 * Called automatically on every login.
 * Creates user document on first login; updates lastLogin on subsequent logins.
 */
exports.syncUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    const { name: bodyName, email: bodyEmail, photoURL } = req.body;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    const now = admin.firestore.FieldValue.serverTimestamp();

    if (!userDoc.exists) {
      // ── First login: create document ──────────────────────
      await userRef.set({
        uid,
        name: bodyName || name,
        email: bodyEmail || email,
        photoURL: photoURL || picture || "",
        role: "",
        createdAt: now,
        lastLogin: now,
        location: "",
        state: "",
        businessCategory: "",
        phone: "",
      });
    } else {
      // ── Subsequent login: update lastLogin only ────────────
      await userRef.update({ lastLogin: now });
    }

    return res.status(200).json({ success: true, message: "User synced." });
  } catch (error) {
    console.error("Error in syncUser:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};

/**
 * GET /api/user/profile
 * Returns the authenticated user's Firestore profile.
 */
exports.getProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User profile not found. Please sign in again.",
      });
    }

    const data = userDoc.data();
    // Convert Firestore Timestamps to ISO strings for JSON serialization
    const profile = {
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      lastLogin: data.lastLogin?.toDate?.()?.toISOString() || null,
    };

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};

/**
 * PUT /api/user/profile
 * Updates editable fields on the user's profile.
 */
exports.updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, location, state, businessCategory, phone, role } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (location !== undefined) updates.location = location.trim();
    if (state !== undefined) updates.state = state.trim();
    if (businessCategory !== undefined) updates.businessCategory = businessCategory.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (role !== undefined) {
      const roleLower = role.toLowerCase().trim();
      if (["buyer", "seller", "both"].includes(roleLower)) {
        updates.role = roleLower;
      }
    }
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection("users").doc(uid).update(updates);

    return res.status(200).json({ success: true, message: "Profile updated." });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};
