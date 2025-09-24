import React, { FC } from "react";
import { TimePickerModal } from "react-native-paper-dates";
import { TimePickerProps } from "./types";
import { View } from "react-native";

const TimePicker: FC<TimePickerProps> = (props) => {
  const { showPicker, setShowPicker, onConfirm } = props;
  return (

    <TimePickerModal
      visible={showPicker}
      onConfirm={onConfirm}
      onDismiss={() => setShowPicker(false)}
      label="Heure"
      cancelLabel="Annuler"
      confirmLabel="Confirmer"
      animationType="fade"
      locale="fr"
      defaultInputType="picker"  // 👈 change ça
      
    />
  );
};

export default TimePicker;
