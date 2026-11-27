const mongoose = require("mongoose");

// #region Poster Item Schema
const posterItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    x: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    y: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
  },
);
// #endregion

//#region Poster Schema
const posterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  poster_items: {
    type: [posterItemSchema],
    required: true,
    validate: {
      validator: function (items) {
        return items.length === 3;
      },
      message: "Poster must contain exactly 3 products!",
    },
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  isLocked: {
    type: Boolean,
    default: true,
  },
},{timestamps: true});
// #endregion

module.exports = mongoose.model("Poster", posterSchema);