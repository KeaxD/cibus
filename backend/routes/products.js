const express = require("express");
const axios = require("axios");
const Product = require("../models/product");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the products section!" });
});

async function checkDatabaseforProduct(barcode) {
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
  });

  await newProduct.save();
  console.log("Product was saved in the database");
  return newProduct;
}

router.post("/add-product", async (req, res) => {
  const { barcode } = req.body;

  try {
    let product = await checkDatabaseforProduct(barcode);

    if (product) {
      // Respond with the existing product
      console.log("Responding with the result");
      return res.json(productResponseJSON(product));
    }

    // Fetch product data from Open Food Facts

    console.log("Fetching data from OpenFoodFacts");
    const response = await axios.get(
      `https://world.openfoodfacts.net/api/v2/product/${barcode}`
    );

    if (response.data.status === 1) {
      const newProduct = await saveProductDataInDatabase(response);

      // Send back the new product details after saving
      return res.json(productResponseJSON(newProduct));
    } else {
      return res.status(404).json({ message: "Product not found in the API" });
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
