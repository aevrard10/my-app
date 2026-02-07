import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";
import { radius, spacing } from "@shared/theme/tokens";
import { useI18n } from "@shared/i18n";

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
  const { t } = useI18n();
  return (
    <CardSurface style={styles.card}>
      <Text
        variant="titleSmall"
        style={[styles.title, { color: colors.onSurface }]}
      >
        {t("quick_actions.title")}
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
          {t("quick_actions.add_feed")}
        </Button>
        <Button
          mode="contained-tonal"
          icon="weight-kilogram"
          onPress={onAddMeasure}
          style={styles.action}
          contentStyle={styles.actionContent}
          labelStyle={styles.actionLabel}
        >
          {t("quick_actions.add_measure")}
        </Button>
        <Button
          mode="outlined"
          icon="calendar-plus"
          onPress={onAddEvent}
          style={styles.action}
          contentStyle={styles.actionContent}
          labelStyle={styles.actionLabel}
        >
          {t("quick_actions.add_event")}
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
            {t("quick_actions.export_pdf")}
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
