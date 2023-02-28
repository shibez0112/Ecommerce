const Category = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(findCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await Category.find();
    res.json(allCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findCategory = await Category.findById(id);
    res.json(findCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id
    );
    res.json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  getAllCategory,
  getCategory,
  deleteCategory
};
