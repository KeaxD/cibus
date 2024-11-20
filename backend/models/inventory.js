const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [
    {
      inventoryItem: {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: {
          type: Number,
          min: 1,
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
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Inventory", inventorySchema);
