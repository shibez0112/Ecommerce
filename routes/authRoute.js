const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUser,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/forgot-password", forgotPasswordToken);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.post("/cart", authMiddleware, userCart);
router.get("/refresh", authMiddleware, handleRefreshToken);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/wishlist", authMiddleware, getWishList);
router.get("/all-users", authMiddleware, isAdmin, getAllUser);
router.get("/logout", authMiddleware, logout);
router.get("/cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/cart", authMiddleware, emptyCart);
router.delete("/:id", authMiddleware, isAdmin, deleteaUser);
router.put("/password", authMiddleware, updatePassword);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/edit-user", authMiddleware, isAdmin, updateaUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
