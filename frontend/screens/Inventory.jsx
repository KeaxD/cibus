import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles/inventory";
import { BACKEND_URI } from "@env";
import * as SecureStore from "expo-secure-store";

import CircleLoadingAnimation from "../components/circleLoading";
import InventoryModal from "../components/inventoryNameModal";

export default function Inventory({ route }) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // State to handle editing
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateField, setDateField] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [updatingInventory, setUpdatingInventory] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inventoryName, setInventoryName] = useState("");

  let category = route.params?.category;

  const endpoint = "inventory";

  useEffect(() => {
    fetchInventory();
  }, [category]);

  const fetchInventory = async () => {
    try {
      console.log("Sending the request....");
      const storedToken = await SecureStore.getItemAsync("token");
      const response = await fetch(
        `${BACKEND_URI}/${endpoint}/${category || ""}`,
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
        const inventoryItemArray = data.data;
        setInventoryItems(inventoryItemArray);
      } else {
        throw new Error("Network response was not daijoubu.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CircleLoadingAnimation />
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

  const handleCreateInventory = async () => {
    setLoading(true);
    setModalVisible(false);
    try {
      console.log("Sending request to create Inventory");
      const storedToken = await SecureStore.getItemAsync("token");
      const response = await fetch(`${BACKEND_URI}/${endpoint}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ name: inventoryName }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Response succesful");
        console.log(data);
        if (data.data === null) {
          setInventoryItems([]);
        }
        setInventoryItems(data.data);
      } else {
        throw new Error("Network response was not good.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;

    // Save the edited item to the backend
    try {
      setUpdatingInventory(true); // Show a loading indicator

      const storedToken = await SecureStore.getItemAsync("token");

      const response = await fetch(
        `${BACKEND_URI}/${endpoint}/update/${editingItem._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            name: editingItem.name,
            quantity: editingItem.quantity,
            location: editingItem.location,
            expirationDate: editingItem.expirationDate,
          }),
        }
      );

      if (response.ok) {
        const { inventoryItem: updatedItem } = await response.json();

        // Update the specific item in the inventoryItems array
        setInventoryItems((prevItems) =>
          prevItems.map((item) =>
            item._id === updatedItem._id ? { ...item, updatedItem } : item
          )
        );

        setEditingMode(false);
        setEditingItem(null); // Exit editing mode
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      setError(error.message);
    } finally {
      setUpdatingInventory(false); // Hide the loading indicator
    }
  };

  const handleEditPress = (item) => {
    setEditingItem({ ...item });
    setEditingMode(true);
  };

  const handleChange = (field, value) => {
    setEditingItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URI}/${endpoint}/${editingItem._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchInventory();
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const changeTime = (e, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
      handleChange(dateField, selectedDate.toISOString());
    }
  };

  const openDatePickerForField = (field) => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRefresh = async () => {
    setUpdatingInventory(true);
    await fetchInventory();
    setUpdatingInventory(false);
  };

  const renderItem = ({ item }) => {
    const isEditing = editingItem && editingItem._id === item._id;
    return (
      <View style={styles.row}>
        {isEditing ? (
          <>
            <TextInput
              style={[styles.cellEdit, { width: 150 }]}
              value={editingItem.name}
              onChangeText={(text) => handleChange("name", text)}
            />
            <TextInput
              style={[styles.cellEdit, { width: 45 }]}
              value={String(editingItem.quantity)}
              onChangeText={(text) =>
                handleChange("quantity", parseInt(text) || 0)
              }
              keyboardType="numeric"
            />
            <Pressable
              style={[styles.cellEdit, { width: 110 }]}
              onPress={() => openDatePickerForField("dateAdded")}
            >
              <Text>{formatDate(editingItem.dateAdded)}</Text>
            </Pressable>
            <TextInput
              style={[styles.cellEdit, { width: 100 }]}
              value={editingItem.location}
              onChangeText={(text) => handleChange("location", text)}
            />

            <Pressable
              style={[styles.cellEdit, { width: 110 }]}
              onPress={() => openDatePickerForField("expirationDate")}
            >
              <Text>{formatDate(editingItem.expirationDate)}</Text>
            </Pressable>
            <Pressable style={styles.button} title="Save" onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonDelete]}
              title="Delete"
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>

            {modalVisible && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                      Are you sure you want to delete {item.name}?
                    </Text>
                    <View
                      style={[{ flexDirection: "row", paddingVertical: 10 }]}
                    >
                      <Pressable
                        style={[styles.button]}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>No</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonDelete]}
                        onPress={() => setModalVisible(handleDelete)}
                      >
                        <Text style={styles.buttonText}>Yes</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </>
        ) : (
          <>
            <Text style={[styles.cell, { width: 150, textAlign: "left" }]}>
              {item.name}
            </Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.quantity}</Text>
            <Text style={[styles.cell, { width: 110 }]}>
              {formatDate(item.dateAdded)}
            </Text>
            <Text style={[styles.cell, { width: 100 }]}>{item.location}</Text>
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
    <ScrollView
      horizontal={true}
      refreshControl={
        <RefreshControl
          refreshing={updatingInventory}
          onRefresh={handleRefresh}
        />
      }
      contentContainerStyle={styles.scrollContainer}
    >
      {inventoryItems == null ? (
        <View style={[styles.centeredView]}>
          <Text style={[{ fontSize: 16, margin: 10 }]}>
            No inventory to display
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[styles.button, styles.buttonCircle]}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <InventoryModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            inventoryName={inventoryName}
            setInventoryName={setInventoryName}
            handleCreateInventory={handleCreateInventory}
          />
        </View>
      ) : inventoryItems.length === 0 ? (
        <View style={styles.centeredView}>
          <Text style={styles.headerText}>Inventory has no items</Text>
        </View>
      ) : (
        <>
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
              <Text style={[styles.headerText, { width: 100 }]}>Location</Text>
              <Text style={[styles.headerText, { width: 110 }]}>
                Expiration Date
              </Text>
              <Text style={[styles.headerText, { width: 54 }]}></Text>

              {editingMode ? (
                <>
                  <Text style={[styles.headerText, { width: 54 }]}></Text>
                </>
              ) : null}
            </View>
            <FlatList data={inventoryItems} renderItem={renderItem} />
          </View>
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
      )}
    </ScrollView>
  );
}
