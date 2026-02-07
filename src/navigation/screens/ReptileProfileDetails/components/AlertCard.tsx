import React from "react";
import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";

type AlertCardProps = {
  alerts?: string[];
};

const AlertCard = ({ alerts }: AlertCardProps) => {
  const { colors } = useTheme();
  const { t } = useI18n();
  if (!alerts || alerts.length === 0) return null;
  return (
    <CardSurface style={[styles.card, { borderColor: "rgba(195,60,60,0.25)" }]}>
      <Text variant="labelLarge" style={{ color: colors.error }}>
        {t("alert_card.title")}
      </Text>
      {alerts.map((msg, idx) => (
        <Text key={idx} variant="bodySmall" style={styles.line}>
          • {msg}
        </Text>
      ))}
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    gap: 4,
  },
  line: {
    color: "#C33C3C",
  },
});

export default AlertCard;
