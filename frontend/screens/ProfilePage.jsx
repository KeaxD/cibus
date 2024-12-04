import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URI } from "@env";
import { useAuth } from "../context/authContext";
import styles from "../styles/profilepage";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";
import CircleLoadingAnimation from "../components/circleLoading";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inventories, setInventories] = useState();
  const [mainInventoryId, setMainInventoryId] = useState(null);

  const { logout } = useAuth();
  const endpoint = "inventory";

  const showMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  const fetchUserInventories = async () => {
    try {
      //Get the token
      const storedToken = await SecureStore.getItemAsync("token");

      //Send the request with the authorization token
      console.log("Fetching user inventories");
      const response = await fetch(
        `${BACKEND_URI}/${endpoint}/user/inventories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInventories(data.data);
        setMainInventoryId(data.mainInventory);
      } else {
        showMessage("There was an error while handling the response");
      }
    } catch (error) {
      showMessage(error.toString());
      console.error(error);
    }
  };

  const makeMainInventory = async (inventoryId) => {
    console.log("Sending a main inventory change request");
    try {
      //Get the token
      const storedToken = await SecureStore.getItemAsync("token");

      //Send the request to the backend
      console.log("Inventory request Id: ", inventoryId);
      const request = await fetch(
        `${BACKEND_URI}/${endpoint}/user/mainInventory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            inventory_id: inventoryId,
          }),
        }
      );

      if (request.ok) {
        const response = await request.json();
        console.log(response.message);
        setMainInventoryId(inventoryId);
      } else {
        showMessage("There was an error while handling the response");
      }
    } catch (error) {
      showMessage(error.toString());
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserInventories();
  }, []);

  if (errorMessage !== "") {
    return (
      <View
        style={[styles.absolute, { top: "50%", left: "20%", width: "100%" }]}
      >
        <Text style={styles.headerText}>{errorMessage}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={[styles.absolute, { top: "50%", left: "0%", width: "100%" }]}
      >
        <CircleLoadingAnimation />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View>
          <Text>Profile Section</Text>
          <IconMCI
            name="account"
            color={"#f4f4f4"}
            size={30}
            style={styles.profileIcon}
            onPress={() => navigation.navigate("ProfilePage")}
          />
        </View>
        <View style={styles.inventoriesContainer}>
          <Text style={styles.heading}>Change Your Main Inventory</Text>
          <View style={styles.inventoriesListContainer}>
            <FlatList
              data={inventories}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.inventoryCard,
                    item.inventory._id === mainInventoryId &&
                      styles.mainInventoryCard,
                  ]}
                  onPress={() => makeMainInventory(item.inventory._id)}
                >
                  <Text style={styles.inventoryCardName}>
                    {item.inventory.name}
                  </Text>
                  <Text style={styles.inventoryCardAttributes}>
                    Collaborators: {item.inventory.collaborators.length}
                  </Text>
                  <Text style={styles.inventoryCardAttributes}>
                    Items: {item.inventory.items.length}
                  </Text>
                  <Text style={styles.inventoryCardAttributes}>
                    Role: {item.role}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </View>
      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
}
