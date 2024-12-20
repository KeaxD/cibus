const express = require("express");
const InventoryItem = require("../models/inventoryItem");
const Product = require("../models/product");

const router = express.Router();

// GET ALL Route
router.get("/", async (req, res) => {
  try {
    console.log("Querying the database...");
    const inventory = await InventoryItem.find().populate("product");
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
    const categories = req.params.category.split(",");
    console.log("Querying the database...");
    const inventory = await getProductsByCategory(categories);
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
    const result = await InventoryItem.findByIdAndUpdate(
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

    const result = await InventoryItem.findByIdAndDelete(id);

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

// DELETE Route by barcode
router.delete("/", async (req, res) => {
  try {
    const { barcode } = req.body;
    const product = await Product.findOne({ barcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await InventoryItem.findOneAndDelete({
      product: product._id,
    });

    if (!result) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    return res.status(200).json({
      message: `Inventory item with barcode: ${barcode} was successfully deleted from your inventory`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server error, we couldn't delete item with barcode: ${barcode}`,
    });
  }
});

async function getProductsByCategory(query) {
  try {
    const inventoryItems = await InventoryItem.find({
      categories: { $in: query },
    });
    return inventoryItems;
  } catch (error) {
    console.error("Error finding items by category:", error);
  }
}

module.exports = router;
