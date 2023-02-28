const express = require("express");
const { createCategory, updateCategory, getAllCategory, getCategory, deleteCategory } = require("../controller/blogCategoryCtrl");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

router.get("/all-category", authMiddleware, isAdmin, getAllCategory);
router.get("/:id", authMiddleware, isAdmin, getCategory);
router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;