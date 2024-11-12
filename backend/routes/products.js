const express = require("express");
const axios = require("axios");
const Product = require("../models/product");
const Inventory = require("../models/inventory");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the products section!" });
});

router.post("/add-product", async (req, res) => {
  const { barcode } = req.body;

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
    const inventoryItem = await addProductToInventory(product, (quantity = 1));

    // Respond with the product and inventory details
    res.status(201).json({
      message: "Product added to inventory",
      product: productResponseJSON(product),
      inventory: inventoryItem,
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
  if (categoriesString.length() > 0) {
    return categoriesString.split(",").map((category) => category.trim());
  }
  return null;
}

async function addProductToInventory(product, quantity) {
  try {
    // Find the inventory item by product ID if it's already in the inventory
    let inventoryItem = await Inventory.findOne({ product: product._id });
    if (inventoryItem) {
      inventoryItem.quantity++;
      await inventoryItem.save();
      return inventoryItem;
    }

    // Check if product.categories exists and is valid
    const categories = product.categories
      ? processCategoryString(product.categories)
      : [];

    // Create a new inventory item
    const newInventoryItem = new Inventory({
      product: product._id,
      name: product.name,
      quantity,
      categories: categories,
    });

    await newInventoryItem.save();
    return newInventoryItem;
  } catch (error) {
    throw new Error("Error adding product to inventory: " + error.message);
  }
}

module.exports = router;
