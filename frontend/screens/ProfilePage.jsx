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

export default function ProfilePage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [inventories, setInventories] = useState();

  const { logout } = useAuth();
  const endpoint = "inventory";

  useEffect(() => {
    fetchUserInventories();
  }, []);

  if (errorMessage !== "") {
    return (
      <View style={[styles.absolute, { top: "50%", left: 0, width: "100%" }]}>
        <Text style={styles.headerText}>{errorMessage}</Text>
      </View>
    );
  }

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
        console.log(data.data[0].inventory.name);
      } else {
        setErrorMessage("There was an error while handling the response");
      }
    } catch (error) {
      setErrorMessage(error);
      console.error(error);
    }
  };

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
        <View style={styles.mainListContainer}>
          <Text style={styles.heading}>Inventories</Text>
          <ScrollView horizontal={true}>
            <FlatList
              data={inventories}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.inventoryCard}>
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
          </ScrollView>
        </View>
      </View>
      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
}
