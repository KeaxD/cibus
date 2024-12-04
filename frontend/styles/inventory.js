import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: "column",
    flexGrow: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingHorizontal: 6,
  },
  headerText: {
    fontSize: 15,
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
    elevation: 1,
    borderRadius: 3,
    paddingVertical: 8,
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
    padding: 8,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "blue",
    height: 40,
    width: "auto",
    margin: 2,
  },
  buttonCircle: {
    width: 50,
    height: 50,
    margin: 8,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
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
    width: "auto",
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
  bubbleContainer: {
    position: "absolute",
    top: "80%",
    left: "80%",
  },
});

export default styles;
