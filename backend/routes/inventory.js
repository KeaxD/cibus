const express = require("express");
const mongoose = require("mongoose");

const Inventory = require("../models/inventory");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all inventory item
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id; //Get the user ID from the middleware

    //Find the user
    const user = await User.findById(userId).populate({
      path: "mainInventory",
      populate: {
        path: "items",
        populate: {
          path: "product",
        },
      },
    });

    //Find the main inventory
    const mainInventory = user.mainInventory;

    //Check if the user has a Main inventory set
    if (!mainInventory) {
      console.log("User doesn't have a main inventory");
      return res.json({
        message: "No main inventory found.",
        data: null,
      });
    }

    //Set the items to main Inventory items
    const inventoryItems = mainInventory.items;

    res.status(200).json({
      result: "success",
      message: "Items found",
      data: inventoryItems,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new inventory
router.post("/create", auth, async (req, res) => {
  //Get the user's ID from the middleware
  const userId = req.user._id;
  const user = await User.findById(userId);

  //Create a new Inventory Object and set the user as the owner of the newly created Inventory
  const inventory = new Inventory({
    name: req.body.name,
    owner: userId,
  });

  try {
    const newInventory = await inventory.save();
    console.log("Inventory Saved");
    user.inventories.push(newInventory._id);
    console.log("Inventory added to the user");
    user.mainInventory = newInventory; //Make the new created inventory the user's main inventory
    await user.save();
    console.log("User changes were saved");
    res.status(201).json(newInventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/update/:id", auth, getInventoryItem, async (req, res) => {
  try {
    const { name, quantity, location, expirationDate } = req.body;

    // Ensure the user is authorized to update the item
    const inventoryItem = req.inventoryItem;
    const inventory = req.inventory;

    console.log("Inventory Item : ", inventoryItem);
    console.log("Inventory : ", inventory);

    // Update the fields if provided in the request body
    if (name !== undefined) inventoryItem.name = name;
    if (quantity !== undefined) inventoryItem.quantity = quantity;
    if (location !== undefined) inventoryItem.location = location;
    if (expirationDate !== undefined)
      inventoryItem.expirationDate = new Date(expirationDate);

    // Mark the subdocument as modified
    inventory.markModified("items");

    // Save the parent Inventory document
    await inventory.save();
    console.log("Inventory saved: ", inventory);
    console.log("Updated Inventory Item : ", inventoryItem);

    res.status(200).json({
      message: "Inventory item updated successfully",
      inventoryItem,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

async function getInventoryItem(req, res, next) {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;

    // Fetch the user's main inventory
    const inventory = await Inventory.findById(req.user.mainInventory).exec();

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Ensure the user has permission to access this inventory
    if (
      String(inventory.owner) !== String(userId) &&
      !inventory.collaborators.includes(userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    console.log("Item id requested: ", itemId);

    console.log("Params: ", req.params);

    // Find the specific inventory item
    const item = inventory.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Attach the item to the request object for downstream handlers
    req.inventoryItem = item;
    req.inventory = inventory;
    next();
  } catch (error) {
    console.error("Error in getInventoryItem middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = router;
