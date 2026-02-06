import React from "react";
import { StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import Skeleton from "@shared/components/Skeleton";

const FeedCardSkeleton = () => {
  return (
    <CardSurface style={styles.card}>
      <View style={styles.header}>
        <Skeleton width={42} height={42} radius={12} />
        <View style={styles.titleBlock}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} style={styles.subtitle} />
        </View>
        <Skeleton width={90} height={24} radius={12} />
      </View>
      <Skeleton width="100%" height={6} radius={6} />
      <View style={styles.footer}>
        <Skeleton width={140} height={36} radius={18} />
        <View style={styles.actions}>
          <Skeleton width={90} height={32} radius={16} />
          <Skeleton width={90} height={32} radius={16} />
        </View>
      </View>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  subtitle: {
    marginTop: 4,
  },
  footer: {
    gap: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
});

export default FeedCardSkeleton;
