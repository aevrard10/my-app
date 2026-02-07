import React, { FC } from "react";
import { TimePickerModal } from "react-native-paper-dates";
import { TimePickerProps } from "./types";
import { useI18n } from "@shared/i18n";

const TimePicker: FC<TimePickerProps> = (props) => {
  const { showPicker, setShowPicker, onConfirm } = props;
  const { t, locale } = useI18n();
  return (

    <TimePickerModal
      visible={showPicker}
      onConfirm={onConfirm}
      onDismiss={() => setShowPicker(false)}
      label={t("agenda.time")}
      cancelLabel={t("common.cancel")}
      confirmLabel={t("common.confirm")}
      animationType="fade"
      locale={locale}
      defaultInputType="picker"
      
    />
  );
};

export default TimePicker;
