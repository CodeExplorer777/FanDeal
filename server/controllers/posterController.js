
const Poster = require("../models/posterModel");

const createPoster = async (req, res) => {
    try {
        const { items } = req.body;

        // Validate number of selected products
        if (!Array.isArray(items) || items.length !== 3) {
            return res.status(400).json({
                message: "Exactly three products are required",
            });
        }

        // Validate categories
        const categories = ["Burger", "Side", "Drink"];

        const selectedCategories = items.map(
            (item) => item.category
        );

        const hasAllCategories = categories.every(
            (category) => selectedCategories.includes(category)
        );

        if (
            !hasAllCategories ||
            new Set(selectedCategories).size !== 3
        ) {
            return res.status(400).json({
                message: "Select one Burger, Side, and Drink",
            });
        }

        // Validate product IDs and coordinates
        const invalidItem = items.some((item) => {
            return (
                !item.productId ||
                !Number.isFinite(Number(item.x)) ||
                !Number.isFinite(Number(item.y)) ||
                Number(item.x) < 0 ||
                Number(item.x) > 100 ||
                Number(item.y) < 0 ||
                Number(item.y) > 100
            );
        });

        if (invalidItem) {
            return res.status(400).json({
                message: "Invalid product ID or coordinates",
            });
        }

        // Check whether user already has a poster
        const existingPoster = await Poster.findOne({
            user_id: req.user.id,
        });

        if (existingPoster) {
            return res.status(409).json({
                message: "You have already submitted a poster",
            });
        }

        // Save poster using actual schema field names
        const poster = await Poster.create({
            user_id: req.user.id,

            poster_items: items.map((item) => ({
                productId: item.productId,
                x: Number(item.x),
                y: Number(item.y),
            })),
        });

        return res.status(201).json({
            message: "Poster submitted successfully",
            poster,
        });

    } catch (error) {
        console.error("Create poster error:", error);

        return res.status(500).json({
            message: "Failed to submit poster",
            error: error.message,
        });
    }
};

// #region GET MY POSTER
const getMyPoster = async (req, res) => {
  try {
    const poster = await Poster.findOne({
      user_id: req.user.id,
    }).populate("poster_items.productId");

    if (!poster) {
      return res.status(404).json({
        message: "No poster found",
      });
    }

    return res.status(200).json({
      message: "Poster fetched successfully",
      poster,
    });
  } catch (error) {
    console.error("Get poster error:", error);

    return res.status(500).json({
      message: "Failed to fetch poster",
    });
  }
};
// #endregion 

// Get all submitted posters (Admin)
const getAllPosters = async (req, res) => {
  try {
    const posters = await Poster.find()
      .populate("user_id", "user_name email")
      .populate("poster_items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({ posters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch posters" });
  }
};

// Update poster status (Admin)
const updatePosterStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const poster = await Poster.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!poster) {
      return res.status(404).json({ message: "Poster not found" });
    }

    res.status(200).json({
      message: `Poster ${status.toLowerCase()} successfully`,
      poster,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update poster status" });
  }
};


module.exports = { createPoster ,getMyPoster,  getAllPosters,
  updatePosterStatus};

