const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

router.get("/profile", protect, (req, res) => {
    res.status(200).json({ message: "User profile accessed successfully", userId: req.user.id });
});

module.exports = router;