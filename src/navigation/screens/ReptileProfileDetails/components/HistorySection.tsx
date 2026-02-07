import React from "react";
import { Button, List, Text, TouchableRipple } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { formatDDMMYYYY } from "@shared/utils/formatedDate";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";

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
  onLoadMoreFeedings?: () => void;
  onLoadMoreSheds?: () => void;
  hasMoreFeedings?: boolean;
  hasMoreSheds?: boolean;
};

const HistorySection = ({
  feedings,
  sheds,
  onDeleteFeeding,
  onDeleteShed,
  onAddShed,
  onLoadMoreFeedings,
  onLoadMoreSheds,
  hasMoreFeedings,
  hasMoreSheds,
}: HistorySectionProps) => {
  const { t } = useI18n();
  return (
    <CardSurface style={styles.card}>
      <List.Accordion
        title={t("history.feed_title")}
        description={t("history.feed_desc")}
        left={(props) => <List.Icon {...props} icon="food" />}
        style={styles.accordion}
      >
        {feedings && feedings.length > 0 ? (
          <View>
            <View style={styles.list}>
              {feedings.map((feeding) => (
                <TouchableRipple
                  key={feeding.id}
                  onLongPress={() => onDeleteFeeding(feeding.id)}
                  style={styles.item}
                >
                  <View>
                    <Text variant="bodyMedium">
                      {feeding.food_name || t("history.feed_default")}
                    </Text>
                    <Text variant="labelSmall" style={styles.meta}>
                      {formatDDMMYYYY(feeding.fed_at)} · {feeding.quantity ?? 1}{" "}
                      {feeding.unit ?? ""}
                    </Text>
                  </View>
                </TouchableRipple>
              ))}
            </View>
            {hasMoreFeedings && onLoadMoreFeedings && (
              <Button
                onPress={onLoadMoreFeedings}
                mode="text"
                style={{ alignSelf: "flex-start" }}
              >
                {t("history.load_more")}
              </Button>
            )}
          </View>
        ) : (
          <Text variant="bodySmall" style={styles.empty}>
            {t("history.feed_empty")}
          </Text>
        )}
      </List.Accordion>

      <List.Accordion
        title={t("history.shed_title")}
        description={t("history.shed_desc")}
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
            {t("history.shed_add")}
          </Button>
        </View>

        {sheds && sheds.length > 0 ? (
          <>
            <View style={styles.list}>
              {sheds.map((shed) => (
                <TouchableRipple
                  key={shed.id}
                  onLongPress={() => onDeleteShed(shed.id)}
                  style={styles.item}
                >
                  <View>
                    <Text variant="bodyMedium">{t("history.shed_item")}</Text>
                    <Text variant="labelSmall" style={styles.meta}>
                      {formatDDMMYYYY(shed.shed_date)}
                    </Text>
                  </View>
                </TouchableRipple>
              ))}
            </View>
            {hasMoreSheds && onLoadMoreSheds && (
              <Button
                onPress={onLoadMoreSheds}
                mode="text"
                style={{ alignSelf: "flex-start" }}
              >
                {t("history.load_more")}
              </Button>
            )}
          </>
        ) : (
          <Text variant="bodySmall" style={styles.empty}>
            {t("history.shed_empty")}
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
