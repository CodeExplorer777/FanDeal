
const express = require("express");

const router = express.Router();

const { createPoster,getMyPoster,  getAllPosters,
  updatePosterStatus, } = require("../controllers/posterController");
const authMiddleware = require("../middlewares/authMiddleware");

// Submit a poster (authentication required)
router.post("/", authMiddleware, createPoster);
router.get("/my-poster",authMiddleware, getMyPoster);


// Admin routes (assignment requirement: no admin login)
router.get("/admin/all", getAllPosters);
router.patch("/admin/:id/status", updatePosterStatus);


module.exports = router;
