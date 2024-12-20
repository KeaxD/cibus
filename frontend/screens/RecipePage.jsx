import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import styles from "../styles/recipepage";

import { BACKEND_URI } from "@env";
import { useEffect, useState } from "react";
import CircleLoadingAnimation from "../components/circleLoading";

export default function RecipePage({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const storedToken = await SecureStore.getItemAsync("token");
    try {
      const response = await fetch(`${BACKEND_URI}/recipes/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: storedToken,
        },
      });

      if (response.ok) {
        const recipeData = await response.json();
        setRecipes(recipeData);
        console.log(recipeData);
        setLoading(false);
      } else {
        console.log(
          "There was a problem receiving recipes:",
          response.statusText
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <CircleLoadingAnimation />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recipe Page</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() =>
              navigation.navigate("RecipeDetails", { recipe: item })
            }
          >
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
