import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
  },
  profileIcon: {
    padding: 5,
    borderRadius: 100,
    backgroundColor: "#333",
    width: 40,
    alignSelf: "flex-end",
    margin: 8,
  },
  inventoriesContainer: {
    paddingVertical: 16,
  },
  heading: {
    fontSize: 16,
    alignSelf: "center",
  },
  inventoryCard: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 5,
    opacity: 0.5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inventoryCardName: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 5,
  },
  inventoryCardAttributes: {
    fontSize: 14,
    margin: 1,
  },
  inventoriesListContainer: {
    flexDirection: "row",
  },
  mainInventoryCard: {
    opacity: 1,
  },
});

export default styles;
