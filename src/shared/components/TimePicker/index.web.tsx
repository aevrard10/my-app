import React, { FC } from "react";
import { TimePickerModal } from "react-native-paper-dates";
import { TimePickerProps } from "./types";

const TimePicker: FC<TimePickerProps> = (props) => {
  const { showPicker, setShowPicker, onConfirm } = props;
  return (
    <TimePickerModal
      visible={showPicker}
      onConfirm={onConfirm}
      onDismiss={() => setShowPicker(false)}
    />
  );
};

export default TimePicker;
