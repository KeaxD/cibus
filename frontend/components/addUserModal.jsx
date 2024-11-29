import {
  StyleSheet,
  Modal,
  View,
  TextInput,
  Pressable,
  Text,
} from "react-native";

const AddUser = ({
  modalVisible,
  setModalVisible,
  userEmail,
  setUserEmail,
  handleAddUserToInventory,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          Enter the email of the person you want to add to your inventory
        </Text>
        <TextInput
          style={styles.inventoryNameInput}
          value={userEmail}
          onChangeText={(text) => setUserEmail(text)}
        />
        <View style={{ flexDirection: "row", paddingVertical: 10 }}>
          <Pressable style={styles.button} onPress={handleAddUserToInventory}>
            <Text style={styles.buttonText}>Confirm</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonDelete]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

export default AddUser;

const styles = StyleSheet.create({
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
  inventoryNameInput: {
    margin: 5,
    width: 200,
    backgroundColor: "#f5f5f5",
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
    width: "auto",
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
});
