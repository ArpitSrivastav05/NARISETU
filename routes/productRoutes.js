const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const productController = require("../controllers/productController");

// POST /api/products/create
router.post("/create", verifyToken, productController.createProduct);

// GET /api/products
router.get("/", productController.getProducts);

// GET /api/products/:id
router.get("/:id", productController.getProduct);

module.exports = router;
