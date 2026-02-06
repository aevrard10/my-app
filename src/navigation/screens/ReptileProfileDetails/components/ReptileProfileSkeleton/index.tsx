import React from "react";
import { StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import Skeleton from "@shared/components/Skeleton";

const ReptileProfileSkeleton = () => {
  return (
    <View style={styles.container}>
      <CardSurface style={styles.hero}>
        <Skeleton height={180} radius={18} />
        <Skeleton height={18} width="50%" style={styles.line} />
        <Skeleton height={12} width="30%" />
      </CardSurface>

      {[0, 1, 2].map((index) => (
        <CardSurface key={index} style={styles.card}>
          <Skeleton height={14} width="40%" />
          <Skeleton height={12} width="80%" style={styles.line} />
          <Skeleton height={12} width="70%" style={styles.line} />
        </CardSurface>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 24,
  },
  hero: {
    gap: 12,
  },
  card: {
    gap: 10,
  },
  line: {
    marginTop: 8,
  },
});

export default ReptileProfileSkeleton;
