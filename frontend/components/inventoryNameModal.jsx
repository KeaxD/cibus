import { StyleSheet } from "react-native";

const InventoryModal = ({
  modalVisible,
  setModalVisible,
  inventoryName,
  setInventoryName,
  handleCreateInventory,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Enter your inventory Name</Text>
        <TextInput
          style={styles.inventoryNameInput}
          value={inventoryName}
          onChangeText={(text) => setInventoryName(text)}
        />
        <View style={{ flexDirection: "row", paddingVertical: 10 }}>
          <Pressable style={styles.button} onPress={handleCreateInventory}>
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

export default InventoryModal;

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
});
