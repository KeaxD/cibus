import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BACKEND_URI } from "@env";

import styles from "../styles/homepage";

export default function CameraPage() {
  const [facing, setFacing] = useState(CameraType);
  const [permission, requestPermission] = useCameraPermissions();
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [scanCooldown, setScanCooldown] = useState(false);
  const [productData, setProductData] = useState(null);

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

    console.log("Scanned data:", data);
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
      const response = await fetch(`${BACKEND_URI}/products/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcode: formattedBarcode,
        }),
      });
      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        setProductData(data);
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
      {productData && (
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{productData.productName}</Text>
        </View>
      )}
    </View>
  );
}
