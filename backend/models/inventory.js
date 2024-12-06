const mongoose = require("mongoose");
const inventoryItemSchema = require("./inventoryItem.js");

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [inventoryItemSchema],
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
  groceryList: { type: [String], default: [] },
});

module.exports = mongoose.model("Inventory", inventorySchema);
