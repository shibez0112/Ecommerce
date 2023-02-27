const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {createBlog, updateBlog, getBlog, getAllBlog, deleteBlog} = require("../controller/blogCtrl");
const router = express.Router();

router.get("/all-blog", getAllBlog);
router.get("/:id", authMiddleware, getBlog);
router.post("/", authMiddleware,isAdmin, createBlog);
router.put("/:id", authMiddleware,isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);


module.exports = router;