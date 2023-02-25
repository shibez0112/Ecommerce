const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productCtrl");
const router = express.Router();
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/all-product", getAllProduct);
router.get("/:id", getaProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id",authMiddleware, isAdmin, deleteProduct)

module.exports = router;
