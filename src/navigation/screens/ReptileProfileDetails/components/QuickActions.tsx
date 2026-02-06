import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";

type QuickActionsProps = {
  onAddFeed: () => void;
  onAddMeasure: () => void;
  onAddEvent: () => void;
  onQuickFeed: () => void;
  loadingQuickFeed?: boolean;
};

const QuickActions = ({
  onAddFeed,
  onAddMeasure,
  onAddEvent,
  onQuickFeed,
  loadingQuickFeed,
}: QuickActionsProps) => {
  return (
    <CardSurface style={styles.card}>
      <Text variant="labelLarge">Actions rapides</Text>
      <View style={styles.row}>
        <Button mode="contained" icon="food" onPress={onAddFeed}>
          Ajouter un repas
        </Button>
        <Button mode="contained-tonal" icon="weight-kilogram" onPress={onAddMeasure}>
          Mesure
        </Button>
        <Button mode="outlined" icon="calendar-plus" onPress={onAddEvent}>
          Événement
        </Button>
        <Button
          mode="contained"
          icon="check"
          onPress={onQuickFeed}
          loading={loadingQuickFeed}
        >
          Nourri aujourd&apos;hui
        </Button>
      </View>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default QuickActions;
