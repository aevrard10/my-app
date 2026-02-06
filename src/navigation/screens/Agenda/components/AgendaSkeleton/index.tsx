import React from "react";
import { StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import Skeleton from "@shared/components/Skeleton";

const AgendaSkeleton = () => {
  return (
    <CardSurface style={styles.card}>
      <View style={styles.calendarHeader}>
        <Skeleton width={120} height={16} />
        <Skeleton width={60} height={12} />
      </View>
      <View style={styles.calendarGrid}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} width={36} height={36} radius={18} />
        ))}
      </View>
      <View style={styles.list}>
        {[0, 1].map((i) => (
          <View key={i} style={styles.item}>
            <Skeleton width={12} height={12} radius={6} />
            <View style={styles.itemText}>
              <Skeleton width="60%" height={12} />
              <Skeleton width="40%" height={10} style={{ marginTop: 6 }} />
            </View>
          </View>
        ))}
      </View>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  list: {
    gap: 12,
    marginTop: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemText: {
    flex: 1,
  },
});

export default AgendaSkeleton;
