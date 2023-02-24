const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const findUser = await User.findOne({ refreshToken });
      if (!findUser)
        throw new Error("No Refresh token present in db or not matched");
      jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err || findUser.id !== decoded.id) {
          throw new Error("There is something wrong with refresh token");
        }
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      });
    } catch (error) {
      throw new Error("Not Authorized token expired");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You re not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
