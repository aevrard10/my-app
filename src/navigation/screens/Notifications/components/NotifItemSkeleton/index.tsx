import React from "react";
import { StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import Skeleton from "@shared/components/Skeleton";

const NotifItemSkeleton = () => {
  return (
    <CardSurface style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={28} height={28} radius={14} />
        <View style={styles.textBlock}>
          <Skeleton width="40%" height={14} />
          <Skeleton width="70%" height={12} style={styles.line} />
        </View>
        <Skeleton width={60} height={12} />
      </View>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  line: {
    marginTop: 4,
  },
});

export default NotifItemSkeleton;
