import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    margin: 8,
    height: "auto",
  },
  profileIcon: {
    padding: 5,
    borderRadius: 100,
    backgroundColor: "#333",
    width: 40,
    margin: 8,
  },
  recipeCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 7,
  },
  recipeImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  groceryListContainer: {
    width: "80%",
    elevation: 5,
    borderRadius: 5,
    backgroundColor: "#f4f4f4",
    minHeight: "35%",
    margin: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default styles;
