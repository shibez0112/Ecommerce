const express = require("express");
const { createUser, loginUserCtrl, getAllUser, getaUser, deleteaUser, updateaUser } = require("../controller/userCtrl");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getAllUser);
router.get("/:id", getaUser);
router.delete("/:id", deleteaUser);
router.patch("/:id", updateaUser);

module.exports = router;
