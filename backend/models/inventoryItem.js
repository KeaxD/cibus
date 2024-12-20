const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  quantity: {
    type: Number,
  },
  location: {
    type: String,
  },
  expirationDate: {
    type: Date,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  categories: { type: Array },
});

module.exports = inventoryItemSchema;
