const express = require("express");
const router = express.Router();
const { registerUser,loginUser } = require("../controllers/authController");

// #region Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
// #endregion
module.exports = router;