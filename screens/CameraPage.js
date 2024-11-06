import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import styles from "../styles/homepage";

export default function CameraPage() {
  const [facing, setFacing] = useState(CameraType);
  const [permission, requestPermission] = useCameraPermissions();
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [scanCooldown, setScanCooldown] = useState(false);

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

  const handleBarScan = ({ data }) => {
    if (scanCooldown) {
      return;
    }

    setScanCooldown(true); //Set the scanner on cooldown

    console.log("Scanned data:", data);
    setBarcodeScanned(true); // Show checkmark when barcode is scanned

    setTimeout(() => {
      setBarcodeScanned(false);
    }, 1000); // Hide checkmark after 2 seconds

    setTimeout(() => {
      setScanCooldown(false);
    }, 1000);
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
    </View>
  );
}
