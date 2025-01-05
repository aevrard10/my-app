export type TimePickerProps = {
  showPicker: boolean;
  setShowPicker: (showPicker: boolean) => void;
  onConfirm: (pickedDuration: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  }) => void;
};
