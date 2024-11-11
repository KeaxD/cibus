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
    textAlign: "center",
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
    alignItems: "center",
  },
  cell: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    marginHorizontal: 3,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "blue",
    height: 40,
    width: 54,
    marginHorizontal: 8,
  },
  buttonDelete: {
    backgroundColor: "red",
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  cellEdit: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    height: 40,
    marginHorizontal: 5,
    borderRadius: 1,
    elevation: 0.5,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
  },
});

export default styles;
