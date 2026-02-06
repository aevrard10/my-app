import React from "react";
import { StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import Skeleton from "@shared/components/Skeleton";

const FeedHistorySkeleton = () => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((index) => (
        <CardSurface key={index} style={styles.card}>
          <View style={styles.row}>
            <Skeleton width={42} height={42} radius={12} />
            <View style={styles.textBlock}>
              <Skeleton width="70%" height={12} />
              <Skeleton width="50%" height={10} style={styles.line} />
            </View>
            <Skeleton width={80} height={24} radius={12} />
          </View>
        </CardSurface>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    padding: 14,
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
    marginTop: 6,
  },
});

export default FeedHistorySkeleton;
