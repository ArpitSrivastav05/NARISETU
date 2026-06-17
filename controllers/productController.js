const { db } = require("../config/firebase");

/**
 * POST /api/products/create
 * Creates a new product listing.
 */
exports.createProduct = async (req, res) => {
  try {
    const { sellerId, productName, category, price, description, imageUrl } = req.body;

    // Validation
    if (!sellerId || !productName || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields.",
        message: "sellerId, productName, category, and price are required.",
      });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid price.",
        message: "Price must be a positive number.",
      });
    }

    // Verify that the seller's business exists
    const sellerDoc = await db.collection("businesses").doc(sellerId).get();
    if (!sellerDoc.exists) {
      return res.status(400).json({
        success: false,
        error: "Invalid sellerId.",
        message: "The specified seller business profile does not exist.",
      });
    }

    const productData = {
      sellerId: sellerId.trim(),
      productName: productName.trim(),
      category: category.toLowerCase().trim(),
      price: priceNum,
      description: (description || "").trim(),
      imageUrl: (imageUrl || "").trim(),
      createdAt: new Date().toISOString(),
    };

    const docRef = db.collection("products").doc();
    await docRef.set(productData);

    return res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...productData,
      },
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};

/**
 * GET /api/products
 * Fetches all products, optionally filtered by category or search term,
 * joining the seller's business details (location, ownerName, businessName, contactNumber).
 */
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = db.collection("products");

    if (category) {
      query = query.where("category", "==", category.toLowerCase().trim());
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Collect products
    let products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Perform case-insensitive search in memory if requested
    if (search) {
      const searchLower = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.productName.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Fetch unique seller business info to merge
    const uniqueSellerIds = [...new Set(products.map((p) => p.sellerId))];
    const sellerMap = {};

    if (uniqueSellerIds.length > 0) {
      // Firestore has a limit of 10 for 'in' queries, so fetch individually or via batching if large.
      // For MVP, simple async fetch works perfectly.
      await Promise.all(
        uniqueSellerIds.map(async (sellerId) => {
          const sellerDoc = await db.collection("businesses").doc(sellerId).get();
          if (sellerDoc.exists) {
            sellerMap[sellerId] = sellerDoc.data();
          }
        })
      );
    }

    // Join seller information into products
    const joinedProducts = products.map((product) => {
      const sellerInfo = sellerMap[product.sellerId] || {};
      return {
        ...product,
        sellerName: sellerInfo.ownerName || "Unknown Seller",
        businessName: sellerInfo.businessName || "Unknown Business",
        location: sellerInfo.location || "N/A",
        contactNumber: sellerInfo.contactNumber || "",
      };
    });

    return res.status(200).json({
      success: true,
      data: joinedProducts,
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};

/**
 * GET /api/products/:id
 * Fetches a single product details with seller info.
 */
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required.",
      });
    }

    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Product listing not found.",
      });
    }

    const productData = doc.data();

    // Fetch seller business details
    const sellerDoc = await db.collection("businesses").doc(productData.sellerId).get();
    const sellerInfo = sellerDoc.exists ? sellerDoc.data() : {};

    return res.status(200).json({
      success: true,
      data: {
        id: doc.id,
        ...productData,
        sellerName: sellerInfo.ownerName || "Unknown Seller",
        businessName: sellerInfo.businessName || "Unknown Business",
        location: sellerInfo.location || "N/A",
        contactNumber: sellerInfo.contactNumber || "",
      },
    });
  } catch (error) {
    console.error("Error in getProduct:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};
