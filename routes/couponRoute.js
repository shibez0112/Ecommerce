const express = require("express");
const { createCoupon, getAllCoupon, getCoupon, updateCoupon, deleteCoupon } = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/all-coupon", authMiddleware, isAdmin, getAllCoupon);
router.get("/:id", authMiddleware, isAdmin, getCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;