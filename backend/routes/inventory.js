const express = require("express");
const Inventory = require("../models/inventory");

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

// GET a Category Route
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    console.log("Querying the database...");
    const inventory = await getProductsByCategory(category);
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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Inventory.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    return res.status(200).json({
      message: `Inventory item id: ${id} was successfully deleted from your inventory`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server error, we couldn't delete item ${id}`,
    });
  }
});

async function getProductsByCategory(category) {
  try {
    const inventoryItems = await Inventory.find({
      categories: { $in: [category] },
    });
    return inventoryItems;
  } catch (error) {
    console.error("Error finding items by category:", error);
  }
}

module.exports = router;
