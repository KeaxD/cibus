import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import styles from "../styles/homepage";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";
import { BACKEND_URI } from "@env";
import { useEffect, useState, useRef } from "react";

export default function HomePage() {
  const navigation = useNavigation();

  const [randomRecipes, setRandomRecipes] = useState([]);
  const [groceryList, setGroceryList] = useState("");

  // Create a ref for the TextInput
  const textInputRef = useRef(null);

  const fetchRandomRecipes = async () => {
    try {
      //Get the token
      const storedToken = await SecureStore.getItemAsync("token");

      //Send the request with the authorization token
      console.log("Fetching user inventories");
      const request = await fetch(`${BACKEND_URI}/recipes/random`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (request.ok) {
        const response = await request.json();
        const data = response.data;
        setRandomRecipes(data);
      } else {
        console.log("There was an error while handling the response");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGroceryList = async () => {
    try {
      console.log("Fetching the grocery List");
      const storedToken = await SecureStore.getItemAsync("token");

      const request = await fetch(
        `${BACKEND_URI}/inventory/grocery/grocery-list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (request.ok) {
        const response = await request.json();
        const data = response.data;
        console.log("Grocery List: ", data);
        setGroceryList(data.join("\n"));
        console.log(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateGroceryList = async () => {
    console.log("Sending grocery list update request");
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      const request = await fetch(
        `${BACKEND_URI}/inventory/grocery/grocery-list/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            updatedGroceryList: groceryList,
          }),
        }
      );

      if (request.ok) {
        const response = await request.json();
        const data = response.data;
        setGroceryList(data);
        console.log(response.message);
        // Remove focus from the TextInput after the save
        textInputRef.current.blur();
      }
    } catch (error) {
      console.error("Error updating grocery list:", error);
    }
  };

  useEffect(() => {
    fetchRandomRecipes();
    fetchGroceryList();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <IconMCI
            name="account"
            color={"#f4f4f4"}
            size={30}
            style={styles.profileIcon}
            onPress={() => navigation.navigate("ProfilePage")}
          />
        </View>
        <Text style={[{ fontSize: 21, fontWeight: "bold", marginTop: 10 }]}>
          Grocery List
        </Text>
        <View style={styles.groceryListContainer}>
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            multiline
            value={groceryList}
            onChangeText={setGroceryList}
            placeholder="Enter your grocery list here..."
          />
          <Button title="Save" onPress={updateGroceryList} />
        </View>
        <Text style={[{ fontSize: 21, fontWeight: "bold", marginTop: 10 }]}>
          Try these recipes
        </Text>
        <FlatList
          data={randomRecipes}
          keyExtractor={(item) => item._id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
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
      </View>
    </SafeAreaView>
  );
}
