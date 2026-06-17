const { db } = require("../config/firebase");

/**
 * POST /api/business/create
 * Creates a new business profile in the Firestore 'businesses' collection.
 */
exports.createBusiness = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      category,
      location,
      description,
      contactNumber,
      profileImage,
    } = req.body;

    // Validation
    if (!businessName || !ownerName || !category || !location || !contactNumber) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields.",
        message: "businessName, ownerName, category, location, and contactNumber are required.",
      });
    }

    const businessData = {
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      category: category.toLowerCase().trim(),
      location: location.trim(),
      description: (description || "").trim(),
      contactNumber: contactNumber.trim(),
      profileImage: (profileImage || "").trim(),
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    const docRef = db.collection("businesses").doc();
    await docRef.set(businessData);

    return res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...businessData,
      },
    });
  } catch (error) {
    console.error("Error in createBusiness:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};

/**
 * GET /api/business/:id
 * Fetches a business profile by document ID.
 */
exports.getBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Business ID is required.",
      });
    }

    const doc = await db.collection("businesses").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Business profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    console.error("Error in getBusiness:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};
