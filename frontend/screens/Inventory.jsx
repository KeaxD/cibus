import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles/inventory";
import { BACKEND_URI } from "@env";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // State to handle editing
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateField, setDateField] = useState(null);

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

  const handleSavePress = async () => {
    // Save the edited item to the backend
    try {
      const response = await fetch(
        `${BACKEND_URI}/inventory/${editingItem._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingItem),
        }
      );

      if (response.ok) {
        const updatedItem = await response.json();
        setInventoryItems((prevItems) =>
          prevItems.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        );
        setEditingItem(null); // Exit editing mode
      } else {
        throw new Error("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleEditPress = (item) => {
    setEditingItem({ ...item });
  };

  const handleChange = (field, value) => {
    setEditingItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const changeTime = (e, selectedDate) => {
    setDate(selectedDate);
    setShowDatePicker(false);
    handleChange(dateField, selectedDate);
  };

  const openDatePickerForField = (field) => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderItem = ({ item }) => {
    const isEditing = editingItem && editingItem._id === item._id;
    return (
      <View style={styles.row}>
        {isEditing ? (
          <>
            <TextInput
              style={[styles.cell, { width: 150, textAlign: "left" }]}
              value={editingItem.name}
              onChangeText={(text) => handleChange("name", text)}
            />
            <TextInput
              style={[styles.cell, { width: 45 }]}
              value={String(editingItem.quantity)}
              onChangeText={(text) => handleChange("quantity", text)}
              keyboardType="numeric"
            />
            <Pressable
              style={[styles.cell, { width: 110 }]}
              onPress={() => openDatePickerForField("dateAdded")}
            >
              <Text>{formatDate(editingItem.dateAdded)}</Text>
            </Pressable>
            <TextInput
              style={[styles.cell, { width: 100 }]}
              value={editingItem.location}
              onChangeText={(text) => handleChange("location", text)}
            />

            <Pressable
              style={[styles.cell, { width: 110 }]}
              onPress={() => openDatePickerForField("expirationDate")}
            >
              <Text>{formatDate(editingItem.expirationDate)}</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              title="Save"
              onPress={handleSavePress}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[styles.cell, { width: 150, textAlign: "left" }]}>
              {item.name}
            </Text>
            <Text style={[styles.cell, { width: 45 }]}> {item.quantity}</Text>
            <Text style={[styles.cell, { width: 110 }]}>
              {formatDate(item.dateAdded)}
            </Text>
            <Text style={[styles.cell, { width: 100 }]}> {item.location}</Text>
            <Text style={[styles.cell, { width: 110 }]}>
              {formatDate(item.expirationDate)}
            </Text>
            <Pressable
              style={styles.button}
              title="Edit"
              onPress={() => handleEditPress(item)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {inventoryItems.length > 0 ? (
        <>
          <ScrollView horizontal>
            <View style={styles.listContainer}>
              <View style={styles.header}>
                <Text
                  style={[styles.headerText, { width: 150, textAlign: "left" }]}
                >
                  Name
                </Text>
                <Text style={[styles.headerText, { width: 45 }]}>Qty</Text>
                <Text style={[styles.headerText, { width: 110 }]}>
                  Date Added
                </Text>
                <Text style={[styles.headerText, { width: 100 }]}>
                  Location
                </Text>
                <Text style={[styles.headerText, { width: 110 }]}>
                  Expiration Date
                </Text>
                <Text style={[styles.headerText, { width: 50 }]}></Text>
              </View>
              <FlatList data={inventoryItems} renderItem={renderItem} />
            </View>
          </ScrollView>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={changeTime}
            />
          )}
        </>
      ) : (
        <>
          <View>
            <Text>Nothing in your inventory</Text>
          </View>
        </>
      )}
    </View>
  );
}
