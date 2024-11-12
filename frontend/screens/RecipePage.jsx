import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SPOONACULAR_API_KEY } from "@env";

export default function RecipePage() {
  // Fetch recipes based on ingredients
  const fetchRecipes = async (ingredients) => {
    try {
      const ingredientString = ingredients.join(","); // Convert ingredients array to comma-separated string
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientString}&apiKey=${SPOONACULAR_API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        return data; // Return recipes data
      } else {
        throw new Error("Failed to fetch recipes");
        x;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return (
    <SafeAreaView>
      <Text>Recipe Page</Text>
    </SafeAreaView>
  );
}
