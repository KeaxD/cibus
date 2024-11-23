const express = require("express");
const axios = require("axios");
const Product = require("../models/product");
const Inventory = require("../models/inventory");

const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the products section!" });
});

router.post("/add-product", auth, async (req, res) => {
  const { barcode } = req.body;

  const userId = req.user._id;
  const user = await User.findById(userId);

  const inventory = await Inventory.findById(user.mainInventory).populate(
    "items.product"
  );

  try {
    let product = await checkDatabaseForProduct(barcode);

    if (!product) {
      // Fetch product data from Open Food Facts
      console.log("Fetching data from OpenFoodFacts");
      const response = await axios.get(
        `https://world.openfoodfacts.net/api/v2/product/${barcode}`
      );

      if (response.data.status !== 1) {
        return res
          .status(404)
          .json({ message: "Product not found in the API" });
        //Will need to handle that so the user can add it manually if needed
      }
      // Save product data in the database
      product = await saveProductDataInDatabase(response);
      console.log("Product successfully saved in the Database");
    }

    // Add the product to the inventory
    const inventoryItem = await addProductToInventory(inventory, product);

    // Respond with the product and inventory details
    res.status(201).json({
      message: "Product added to inventory",
      product: productResponseJSON(product),
      inventoryItem: inventoryItem,
    });
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

async function checkDatabaseForProduct(barcode) {
  try {
    // Check if the product already exists in the database
    console.log("Checking the database for the product: ", {
      barcode,
    });

    const product = await Product.findOne({ barcode });
    return product ? product : null;
  } catch (e) {
    console.error("Error checking the databse: ", e);
    throw e;
  }
}

function productResponseJSON(product) {
  return {
    productName: product.name,
    barcode: product.barcode,
    brands: product.brands,
    ingredients: product.ingredients,
    nutriments: product.nutriments,
  };
}

async function saveProductDataInDatabase(response) {
  const productData = response.data.product;
  const newProduct = new Product({
    name: productData.product_name,
    barcode: productData.code,
    brands: productData.brands,
    ingredients: productData.ingredients_text,
    nutriments: {
      energy: productData.nutriments.energy,
      fat: productData.nutriments.fat,
      carbohydrates: productData.nutriments.carbohydrates,
      sugars: productData.nutriments.sugar,
      proteins: productData.nutriments.proteins,
      salt: productData.nutriments.salt,
    },
    categories: productData.categories,
  });

  await newProduct.save();
  console.log("Product was saved in the database");
  return newProduct;
}

function processCategoryString(categoriesString) {
  if (categoriesString.length > 0) {
    return categoriesString.split(",").map((category) => category.trim());
  }
  return null;
}

async function addProductToInventory(inventory, product) {
  try {
    // Ensure that inventory.items is an array (initialize if not defined)
    if (!Array.isArray(inventory.items)) {
      inventory.items = [];
    }

    const existingItem = inventory.items.find((item) => {
      return item.product._id.toString() === product._id.toString();
    });

    if (existingItem) {
      // If the product exists, increment the quantity
      existingItem.quantity += 1;
      console.log("UPDATED THE QUANTITY");
      await inventory.save();
      return existingItem; // Return the updated inventory item
    } else {
      // If the product doesn't exist, create a new inventory item
      console.log("Creating a new inventory Item");
      const newInventoryItem = {
        product: product._id,
        name: product.name,
        quantity: 1,
        categories: processCategoryString(product.categories),
      };
      inventory.items.push(newInventoryItem);
    }

    await inventory.save(); // Save the updated inventory

    console.log(
      existingItem ? existingItem : inventory.items[inventory.items.length - 1]
    );

    return existingItem
      ? existingItem
      : inventory.items[inventory.items.length - 1];
  } catch (error) {
    throw new Error("Error adding product to inventory: " + error.message);
  }
}

module.exports = router;
