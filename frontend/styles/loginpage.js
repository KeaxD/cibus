import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    margin: 10,
    color: "blue",
  },
  errorText: {
    textAlign: "center",
    margin: 10,
    color: "red",
  },
});

export default styles;
