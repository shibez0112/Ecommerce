const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productCtrl");
const router = express.Router();

router.post("/", createProduct);
router.get("/all-product", getAllProduct);
router.get("/:id", getaProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct)

module.exports = router;
