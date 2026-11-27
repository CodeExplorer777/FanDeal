const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_category: {
      type: String,
      required: true,
      enum: ["Burger", "Side", "Drink"],
    },
    image_url: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);