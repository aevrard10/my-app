import React, { FC } from "react";
import { TimerPickerModal } from "react-native-timer-picker";
import { TimePickerProps } from "./types";
import { useI18n } from "@shared/i18n";

const TimePicker: FC<TimePickerProps> = (props) => {
  const { showPicker, setShowPicker, onConfirm } = props;
  const { t } = useI18n();

  return (
    <TimerPickerModal
      visible={showPicker}
      setIsVisible={setShowPicker}
      onConfirm={onConfirm}
      cancelButtonText={t("common.cancel")}
      confirmButtonText={t("common.confirm")}
      onCancel={() => setShowPicker(false)}
      closeOnOverlayPress
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
