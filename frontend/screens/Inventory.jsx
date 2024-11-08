import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import axios from "axios";
import styles from "../styles/inventory";
import { BACKEND_URI } from "@env";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        console.log("Sending the request....");
        const response = await fetch(`${BACKEND_URI}/inventory/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Response succesful");
          console.log(data.inventory);
          setInventoryItems(data.inventory);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <Text style={[styles.cell, { width: 150 }]}>{item.product.name}</Text>
        <Text style={[styles.cell, { width: 45 }]}> {item.quantity}</Text>
        <Text style={[styles.cell, { width: 100 }]}> {item.location}</Text>
        <Text style={[styles.cell, { width: 110 }]}>
          {formatDate(item.dateAdded)}
        </Text>
        <Text style={[styles.cell, { width: 110 }]}>
          {formatDate(item.expirationDate)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.listContainer}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { width: 150 }]}>Name</Text>
            <Text style={[styles.headerText, { width: 45 }]}>Qty</Text>
            <Text style={[styles.headerText, { width: 100 }]}>Location</Text>
            <Text style={[styles.headerText, { width: 110 }]}>Date Added</Text>
            <Text style={[styles.headerText, { width: 110 }]}>
              Expiration Date
            </Text>
          </View>
          <FlatList
            data={inventoryItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
}
