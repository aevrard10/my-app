import React, { FC } from "react";
import { TimerPickerModal } from "react-native-timer-picker";
import { TimePickerProps } from "./types";

const TimePicker: FC<TimePickerProps> = (props) => {
  const { showPicker, setShowPicker, onConfirm } = props;

  return (
    <TimerPickerModal
      visible={showPicker}
      setIsVisible={setShowPicker}
      onConfirm={onConfirm}
      modalTitle="Set Alarm"
      cancelButtonText="Annuler"
      confirmButtonText="Confirmer"
      onCancel={() => setShowPicker(false)}
      closeOnOverlayPress
      Audio={Audio}
      styles={{
        theme: "light",
      }}
      modalProps={{
        overlayOpacity: 0.2,
      }}
    />
  );
};

export default TimePicker;
