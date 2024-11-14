const express = require("express");
const axios = require("axios");
const Recipe = require("../models/recipe");
const Inventory = require("../models/inventory");
require("dotenv").config();

const router = express.Router();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the recipes section!" });
});

router.get("/all", async (req, res) => {
  try {
    const recipes = await fetchRecipesFromIngredients();

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "Could not find any recipes" });
    }

    await saveRecipeDataInDatabase(recipes);

    res.status(202).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Error fetching recipes", error });
  }
});

async function saveRecipeDataInDatabase(recipeDataArray) {
  const savedRecipes = [];

  //Loop through each recipe and check if we have it in the database
  for (const recipeData of recipeDataArray) {
    try {
      // Check if the recipe already exists
      const existingRecipe = await Recipe.findOne({ title: recipeData.title });
      if (existingRecipe) {
        console.log(
          "Recipe already exists in the database:",
          existingRecipe.title
        );
        savedRecipes.push(existingRecipe);
        continue; // Skip saving this recipe
      }

      const newRecipe = new Recipe({
        title: recipeData.title,
        image: recipeData.image,
        instructions: recipeData.instructions || "",
      });

      const savedRecipe = await newRecipe.save();
      savedRecipes.push(savedRecipe);
    } catch (error) {
      console.error("Error saving recipe:", recipeData.title, error);
    }
  }
  return savedRecipes;
}

const fetchRecipesFromIngredients = async () => {
  try {
    const ingredientString = await fetchIngredientsFromInventory();
    console.log("Sending request to Spoonacular");
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientString}&apiKey=${SPOONACULAR_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();

      // Fetch full recipe details
      const recipesWithDetails = await Promise.all(
        data.map(async (recipe) => {
          //Check if the database has this recipe already
          const existingRecipe = await Recipe.findOne({
            title: recipe.title,
          });
          if (existingRecipe) {
            return {
              ...existingRecipe.toObject(),
              usedIngredients: recipe.usedIngredients,
              missedIngredients: recipe.missedIngredients,
            };
          } else {
            const detailsResponse = await axios.get(
              `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`
            );
            const recipeDetails =
              detailsResponse.status === 200 ? detailsResponse.data : recipe;

            return {
              ...recipeDetails,
              usedIngredients: recipe.usedIngredients,
              missedIngredients: recipe.missedIngredients,
            };
          }
        })
      );

      return recipesWithDetails;
    } else {
      throw new Error("Failed to fetch recipes");
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchIngredientsFromInventory = async () => {
  // Fetch inventory items from your backend
  try {
    console.log("Querying the database for Ingredients");
    const inventoryResponse = await Inventory.find().populate("product");
    const ingredients = inventoryResponse.map((item) => item.name);
    const ingredientString = ingredients.join(",");
    console.log("Ingredients found: ", ingredientString);
    return ingredientString;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return "";
  }
};

module.exports = router;
