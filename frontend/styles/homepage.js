import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  checkmark: {
    position: "absolute",
    top: "50%", // Center the checkmark vertically
    left: "50%", // Center the checkmark horizontally
    fontSize: 20, // Large checkmark
    color: "green", // Green color for the checkmark
    transform: [{ translateX: -50 }, { translateY: -50 }], // Adjust positioning to truly center
  },
  productInfo: {
    padding: 20,
    alignItems: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productBrand: {
    fontSize: 16,
  },
  productIngredients: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  tab: {
    padding: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: "blue",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
