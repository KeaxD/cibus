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

//Get all inventory items in a category
router.get("/:categories", auth, async (req, res) => {
  try {
    const categoriesString = req.params.categories; //Get the string from the request params
    categories = categoriesString.split(","); //Split it to turn it into an array of strings

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

    const inventoryItems = mainInventory.items.filter((item) =>
      categories.some((category) => item.product.categories.includes(category))
    );

    console.log(
      "Inventory Items found for the categories: ",
      categories,
      inventoryItems
    );

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
    user.inventories.push({ inventory: newInventory._id, role: "owner" }); //Make sure that the user is the owner
    console.log("Inventory added to the user");
    user.mainInventory = newInventory._id; //Make the newly created inventory the user's main inventory
    await user.save();
    console.log("User changes were saved");
    res.status(201).json(newInventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Patch an inventory Item
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
    console.log("Location before: ", inventoryItem.location);
    if (location !== undefined) inventoryItem.location = location;
    console.log("Location after: ", inventoryItem.location);
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

//Delete an Inventory Item using the inventory page
router.delete("/delete/:id", auth, getInventoryItem, async (req, res) => {
  try {
    // Ensure the user is authorized to update the item
    const inventory = req.inventory;

    // Use the pull method to remove the subdocument
    inventory.items.pull(req.params.id);

    // Save the parent Inventory document
    await inventory.save();

    res.status(200).json({
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Substract the quantity of an Inventory Item by barcode
router.delete("/delete", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const barcode = req.body.barcode;

    // Fetch the user's main inventory
    const user = await User.findById(userId).populate({
      path: "mainInventory",
      populate: {
        path: "items",
        populate: {
          path: "product",
        },
      },
    });

    const mainInventory = user.mainInventory;

    // Check if the item exists in the inventory
    const item = mainInventory.items.find(
      (item) => item.product.barcode === barcode
    );

    if (!item) {
      return res
        .status(404)
        .json({ message: "Inventory item not found in your inventory" });
    }

    // Substract one from the quantity
    item.quantity--;

    // If the quantity reaches 0, remove the item completely from the inventory
    if (item.quantity === 0) {
      // Use the `pull` method to remove the item from the inventory's items array
      mainInventory.items.pull(item._id);
    }

    //Save the changes
    mainInventory.save();

    res.status(200).json({
      message: `Item quantity successfully updated ${item.quantity}`,
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/share", auth, async (req, res) => {
  try {
    //Finding the requested collaborator
    const collaboratorEmail = req.body.email;
    const collaborator = await User.findOne({ email: collaboratorEmail });

    if (!collaborator) {
      console.log("Collaborator not found");
      return res.status(404).json({ message: "User could not be found" });
    }

    console.log("Collaborator found: ", collaborator);

    //Getting the owner main inventory
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: "mainInventory",
      populate: {
        path: "items",
        populate: {
          path: "product",
        },
      },
    });
    const mainInventory = user.mainInventory;

    //Add the collaborator the the main inventory
    mainInventory.collaborators.push(collaborator._id);

    //Add the inventory to the collaborator's inventories
    collaborator.inventories.push({
      inventory: mainInventory._id,
      role: "viewer",
    });

    //Set it as the main inventory
    collaborator.mainInventory = mainInventory._id;

    //Save both element
    await mainInventory.save();
    await collaborator.save();
    res.status(200).json({ message: "Collaborator added successfully" });
  } catch (error) {
    console.error("Error sharing inventory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get all inventories of a user
router.get("/user/inventories", auth, async (req, res) => {
  try {
    const userId = req.user._id; //Get the user ID from the middleware

    //Find the user
    const user = await User.findById(userId).populate({
      path: "inventories",
      populate: {
        path: "inventory",
      },
    });

    const inventories = user.inventories;
    const mainInventory = user.mainInventory;

    res.status(200).json({
      result: "success",
      message: "Items found",
      data: inventories,
      mainInventory: mainInventory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Make the requested inventory the user's main inventory
router.post("/user/mainInventory", auth, async (req, res) => {
  try {
    //Get the inventory Id from the request body and the userID from the middleware
    const inventoryId = req.body.inventory_id;
    const userId = req.user._id;

    console.log("Inventory ID received: ", inventoryId);
    console.log("User ID received: ", userId);

    //get the user
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Check if the new Main Inventory is not the current one
    if (user.mainInventory._id.toString() === inventoryId) {
      return res
        .status(200)
        .json({ message: "This is already your main Inventory" });
    }

    //get the new main inventory
    const newMainInventory = await Inventory.findById(inventoryId);

    if (!newMainInventory) {
      return res.status(404).json({ message: "Inventory could not be found" });
    }

    console.log("New Main Inventory found: ", newMainInventory);

    //set the user's main inventory to the requested inventory
    user.mainInventory = newMainInventory._id;
    user.save();

    res.status(200).json({
      result: "success",
      message: "Main inventory successfuly changed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Middleware to get Inventory and Inventory Item
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
