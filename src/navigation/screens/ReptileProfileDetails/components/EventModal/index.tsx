import { FC } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";

type EventModalProps = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  addPress: () => void;
  cancelPress: () => void;
};
const EventModal: FC<EventModalProps> = (props) => {
  const { visible, value, onChangeText, addPress, cancelPress } = props;
  return (
    <Modal
      visible={visible}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ajouter un événement</Text>
          <View style={styles.inputSection}>
            <TextInput
              placeholder="Description de l'événement"
              value={value}
              onChangeText={onChangeText}
              style={styles.input}
            />
          </View>
          <View style={styles.button}>
            <Button mode="contained" onPress={addPress}>
              Ajouter
            </Button>
            <Button mode="contained" onPress={cancelPress}>
              Annuler
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  outlineStyle: {
    borderWidth: 0,
  },
  pickerInput: {
    borderWidth: 0,
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderTopColor: "#fff",
    // backgroundColor: "red",
    position: "relative",
  },
  input: {
    padding: 10,
    outlineStyle: "none",
    borderRadius: 30,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  button: {
    gap: 10,
  },
  inputSection: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
export default EventModal;
