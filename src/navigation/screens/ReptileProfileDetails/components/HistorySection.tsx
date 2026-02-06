import React from "react";
import { Button, List, Text, TouchableRipple } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { formatDDMMYYYY } from "@shared/utils/formatedDate";
import CardSurface from "@shared/components/CardSurface";

type Feeding = {
  id: string;
  food_name?: string | null;
  fed_at: string;
  quantity?: number | null;
  unit?: string | null;
};

type Shed = {
  id: string;
  shed_date: string;
};

type HistorySectionProps = {
  feedings?: Feeding[];
  sheds?: Shed[];
  onDeleteFeeding: (id: string) => void;
  onDeleteShed: (id: string) => void;
  onAddShed: () => void;
};

const HistorySection = ({
  feedings,
  sheds,
  onDeleteFeeding,
  onDeleteShed,
  onAddShed,
}: HistorySectionProps) => {
  return (
    <CardSurface style={styles.card}>
      <List.Accordion
        title="Historique repas"
        description="5 derniers"
        left={(props) => <List.Icon {...props} icon="food" />}
        style={styles.accordion}
      >
        {feedings && feedings.length > 0 ? (
          <View style={styles.list}>
            {feedings.slice(0, 5).map((feeding) => (
              <TouchableRipple
                key={feeding.id}
                onLongPress={() => onDeleteFeeding(feeding.id)}
                style={styles.item}
              >
                <View>
                  <Text variant="bodyMedium">
                    {feeding.food_name || "Repas"}
                  </Text>
                  <Text variant="labelSmall" style={styles.meta}>
                    {formatDDMMYYYY(feeding.fed_at)} · {feeding.quantity ?? 1}{" "}
                    {feeding.unit ?? ""}
                  </Text>
                </View>
              </TouchableRipple>
            ))}
          </View>
        ) : (
          <Text variant="bodySmall" style={styles.empty}>
            Aucun repas enregistré.
          </Text>
        )}
      </List.Accordion>

      <List.Accordion
        title="Historique des mues"
        description="5 dernières"
        left={(props) => <List.Icon {...props} icon="leaf" />}
        style={styles.accordion}
      >
        <View style={{ marginBottom: 10, alignSelf: "flex-end" }}>
          <Button
            icon="plus"
            mode="outlined"
            onPress={onAddShed}
            style={{ marginBottom: 6, marginTop: 4 }}
          >
            Ajouter une mue
          </Button>
        </View>
        {sheds && sheds.length > 0 ? (
          <View style={styles.list}>
            {sheds.slice(0, 5).map((shed) => (
              <TouchableRipple
                key={shed.id}
                onLongPress={() => onDeleteShed(shed.id)}
                style={styles.item}
              >
                <View>
                  <Text variant="bodyMedium">Mue enregistrée</Text>
                  <Text variant="labelSmall" style={styles.meta}>
                    {formatDDMMYYYY(shed.shed_date)}
                  </Text>
                </View>
              </TouchableRipple>
            ))}
          </View>
        ) : (
          <Text variant="bodySmall" style={styles.empty}>
            Aucune mue enregistrée.
          </Text>
        )}
      </List.Accordion>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    gap: 12,
  },
  accordion: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  list: {
    gap: 8,
  },
  item: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  meta: {
    opacity: 0.6,
    marginTop: 2,
  },
  empty: {
    opacity: 0.6,
  },
});

export default HistorySection;
