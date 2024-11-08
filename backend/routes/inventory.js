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

// Route to add details to a product to the inventory
router.post("/add-to-inventory", async (req, res) => {
  const { barcode, quantity, location, expirationDate } = req.body;

  try {
    // Find the product by barcode
    const product = await Product.findOne({ barcode });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the inventory item by product ID if it's already in the inventory
    const inventoryItem = await Inventory.findOne({ product: product._id });
    if (inventoryItem) {
      inventoryItem.quantity++;
      await inventoryItem.save();
      return res.status(200).json({
        message: "Product quantity was updated: ",
        inventoryItem,
      });
    }

    //Create a new inventory item
    const newInventoryItem = new Inventory({
      product: product._id,
      quantity,
      location,
      expirationDate,
    });

    await newInventoryItem.save();
    res
      .status(201)
      .json({ message: "Product added to inventory", newInventoryItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product to inventory", error });
  }
});

module.exports = router;
