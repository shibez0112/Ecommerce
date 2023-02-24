const express = require("express");
const { createProduct, getaProduct, getAllProduct } = require("../controller/productCtrl");
const router = express.Router();

router.post("/", createProduct);
router.get("/all-product", getAllProduct);
router.get("/:id", getaProduct);




module.exports = router;