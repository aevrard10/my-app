import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";
import { radius, spacing } from "@shared/theme/tokens";

type QuickActionsProps = {
  onAddFeed: () => void;
  onAddMeasure: () => void;
  onAddEvent: () => void;

  onExportPdf?: () => void;
};

const QuickActions = ({
  onAddFeed,
  onAddMeasure,
  onAddEvent,
  onExportPdf,
}: QuickActionsProps) => {
  const { colors } = useTheme();
  return (
    <CardSurface style={styles.card}>
      <Text
        variant="titleSmall"
        style={[styles.title, { color: colors.onSurface }]}
      >
        Actions rapides
      </Text>
      <View style={styles.row}>
        <Button
          mode="contained"
          icon="food"
          onPress={onAddFeed}
          style={styles.action}
          contentStyle={styles.actionContent}
          labelStyle={styles.actionLabel}
        >
          Ajouter un repas
        </Button>
        <Button
          mode="contained-tonal"
          icon="weight-kilogram"
          onPress={onAddMeasure}
          style={styles.action}
          contentStyle={styles.actionContent}
          labelStyle={styles.actionLabel}
        >
          Mesure
        </Button>
        <Button
          mode="outlined"
          icon="calendar-plus"
          onPress={onAddEvent}
          style={styles.action}
          contentStyle={styles.actionContent}
          labelStyle={styles.actionLabel}
        >
          Événement
        </Button>
        {onExportPdf && (
          <Button
            mode="outlined"
            icon="file-pdf-box"
            onPress={onExportPdf}
            style={[styles.action, styles.actionWide]}
            contentStyle={styles.actionContent}
            labelStyle={styles.actionLabel}
          >
            Export PDF
          </Button>
        )}
      </View>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  title: {
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  action: {
    flexGrow: 1,
    flexBasis: "48%",
    minWidth: 150,
    borderRadius: radius.sm,
  },
  actionWide: {
    flexBasis: "100%",
  },
  actionContent: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  actionLabel: {
    textAlign: "center",
  },
});

export default QuickActions;
