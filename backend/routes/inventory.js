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

module.exports = router;
