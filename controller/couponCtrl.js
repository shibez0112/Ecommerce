const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req,res)=>{
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(findCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const getAllCoupon = asyncHandler(async (req, res) => {
    try {
      const allCoupon = await Coupon.find();
      res.json(allCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findCoupon = await Coupon.findById(id);
      res.json(findCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deleteCoupon = await Coupon.findByIdAndDelete(id
      );
      res.json(deleteCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = {createCoupon, updateCoupon, getCoupon, getAllCoupon, deleteCoupon};