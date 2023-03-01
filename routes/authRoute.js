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
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/forgot-password", forgotPasswordToken);
router.post("/cart", authMiddleware, userCart);
router.get("/refresh", authMiddleware, handleRefreshToken);
router.get("/wishlist", authMiddleware, getWishList);
router.get("/all-users", authMiddleware, isAdmin, getAllUser);
router.get("/logout", authMiddleware, logout);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", authMiddleware, isAdmin, deleteaUser);
router.put("/password", authMiddleware, updatePassword);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/edit-user", authMiddleware, isAdmin, updateaUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
