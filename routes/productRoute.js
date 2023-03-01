const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
} = require("../controller/productCtrl");
const router = express.Router();
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/all-product", getAllProduct);
router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10),productImgResize, uploadImages);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id",authMiddleware, isAdmin, deleteProduct)

module.exports = router;
