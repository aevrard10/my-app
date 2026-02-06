import React from "react";
import { StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import Skeleton from "@shared/components/Skeleton";

const ReptileCardSkeleton = () => {
  return (
    <CardSurface style={styles.card}>
      <View style={styles.media}>
        <Skeleton height={180} radius={0} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Skeleton width="55%" height={16} />
            <Skeleton width="35%" height={12} style={styles.subtitle} />
          </View>
          <Skeleton width={28} height={28} radius={14} />
        </View>
        <View style={styles.actions}>
          <Skeleton width={120} height={36} radius={18} />
          <Skeleton width={160} height={36} radius={18} />
        </View>
      </View>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginBottom: 16,
    padding: 0,
    overflow: "hidden",
  },
  media: {
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  body: {
    padding: 16,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  subtitle: {
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default ReptileCardSkeleton;
