import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

import { BACKEND_URI } from "@env";

import styles from "../styles/homepage";

export default function CameraPage() {
  const [facing, setFacing] = useState(CameraType);
  const [permission, requestPermission] = useCameraPermissions();
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [scanCooldown, setScanCooldown] = useState(false);
  const [productData, setProductData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("add");

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleBarScan = async ({ data }) => {
    if (scanCooldown) {
      return;
    }

    setScanCooldown(true); //Set the scanner on cooldown

    setBarcodeScanned(true); // Show checkmark when barcode is scanned

    setTimeout(() => {
      setBarcodeScanned(false);
    }, 1000); // Hide checkmark after 1 seconds

    //Request
    await sendBarcodeToBackend(data);

    setTimeout(() => {
      setScanCooldown(false);
    }, 2000);
  };

  function addLeadingZeroIfNeeded(barcode) {
    // Check if the barcode has exactly 12 digits
    if (barcode.length === 12) {
      // Add a leading zero
      return "0" + barcode;
    }
    return barcode;
  }

  const sendBarcodeToBackend = async (barcodeData) => {
    const formattedBarcode = addLeadingZeroIfNeeded(barcodeData);
    try {
      const endpoint =
        selectedTab === "add" ? "products/add-product" : "inventory";
      const method = selectedTab === "add" ? "POST" : "DELETE";

      const response = await fetch(`${BACKEND_URI}/${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcode: formattedBarcode,
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        if (selectedTab === "add") {
          setProductData(data);
        }
        console.log("Server response successfully received");
      } else {
        console.log(response, "Server Error");
      }
    } catch (error) {
      console.error("Error sending barcode to backend:", error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarScan}
      >
        <View style={styles.buttonContainer}>
          {barcodeScanned && (
            <Text style={styles.checkmark}>Scan successful ✔</Text> // Display checkmark
          )}
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "add" && styles.selectedTab]}
          onPress={() => setSelectedTab("add")}
        >
          <Text style={styles.tabText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "delete" && styles.selectedTab]}
          onPress={() => setSelectedTab("delete")}
        >
          <Text style={styles.tabText}>Delete</Text>
        </TouchableOpacity>
      </View>
      {productData && (
        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {productData.product.productName}
          </Text>
          <Text style={styles.productBrand}>
            Current Quantity: {productData.inventory.quantity}
          </Text>
        </View>
      )}
    </View>
  );
}
