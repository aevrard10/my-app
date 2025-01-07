import { FC } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { Appbar, Button, Modal, Portal, Surface } from "react-native-paper";

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
      onDismiss={cancelPress}
      contentContainerStyle={{
        backgroundColor: "white",
        marginHorizontal: 20,
        padding: 20,
        gap: 10,
      }}
    >
      <Appbar.Header
        style={[
          {
            backgroundColor: "#fff",
          },
        ]}
      >
        <Appbar.BackAction onPress={cancelPress} />
        <Appbar.Content title="Ajouter une événement" />
      </Appbar.Header>
      <Surface style={styles.inputSection}>
        <TextInput
          placeholder="Description de l'événement"
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      </Surface>
      <View style={styles.button}>
        <Button mode="contained" onPress={addPress}>
          Ajouter
        </Button>
        <Button mode="contained" onPress={cancelPress}>
          Annuler
        </Button>
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
