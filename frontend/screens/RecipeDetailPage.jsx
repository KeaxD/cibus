// screens/RecipeDetailPage.jsx
import React from "react";
import { View, Text, Image, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHtml from "react-native-render-html";
import { LogBox } from "react-native";

import styles from "../styles/recipedetailspage";

const RecipeDetailPage = ({ route }) => {
  //Ignore deprecation messages
  LogBox.ignoreLogs([/Support for defaultProps will be removed/]);

  const { recipe } = route.params;
  const { width } = Dimensions.get("window");

  // Function to split instructions into sentences and format as HTML list items
  const formatInstructions = (instructions) => {
    const sentences = instructions
      .split(".")
      .filter((sentence) => sentence.trim().length > 0);
    const htmlList = `<ol>${sentences
      .map((sentence) => `<li>${sentence.trim()}.</li>`)
      .join("")}</ol>`;
    return htmlList;
  };

  // Function to format ingredient list
  const formatIngredients = (ingredients) => {
    return ingredients.map((ingredient) => ingredient.name).join(", ");
  };
  // Check for ingredients and format them
  const getFormattedIngredients = (recipe) => {
    const formattedIngredients = {
      usedIngredients: recipe.usedIngredients
        ? formatIngredients(recipe.usedIngredients)
        : "No used ingredients",
      missedIngredients: recipe.missedIngredients
        ? formatIngredients(recipe.missedIngredients)
        : "No missed ingredients",
    };
    return formattedIngredients;
  };

  const { usedIngredients, missedIngredients } =
    getFormattedIngredients(recipe);

  const formattedInstructions = formatInstructions(recipe.instructions);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.subtitle}>Used Ingredients: {usedIngredients}</Text>
        <Text style={styles.subtitle}>
          Missed Ingredients: {missedIngredients}
        </Text>
        <Text style={styles.subtitle}>Instructions: </Text>
        <RenderHtml
          contentWidth={width}
          source={{ html: formattedInstructions }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeDetailPage;
