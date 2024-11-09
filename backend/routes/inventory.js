const express = require("express");
const Inventory = require("../models/inventory");
const Product = require("../models/product");

const router = express.Router();

// GET ALL Route
router.get("/", async (req, res) => {
  try {
    console.log("Querying the database...");
    const inventory = await Inventory.find().populate("product");
    if (!inventory) {
      console.log("Couldn't query the database");
    }
    console.log("Found the database, sending the data...");
    res.json({ inventory });
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error });
  }
});

// PATCH One Route: Update inventory item
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = req.body;

    // Find the item by ID and update it with the new data
    const result = await Inventory.findByIdAndUpdate(
      id,
      { $set: updatedItem },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
