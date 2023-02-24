const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const allProduct = await Product.find();
    res.json(allProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// 2:43:17

module.exports = { createProduct, getaProduct, getAllProduct };
