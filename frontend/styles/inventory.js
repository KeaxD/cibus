import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  headerText: {
    fontSize: 15,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    marginHorizontal: 1,
    elevation: 1,
    borderRadius: 3,
    paddingVertical: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 6,
  },
  cell: {
    fontSize: 14,
    flex: 1,
  },
});

export default styles;
