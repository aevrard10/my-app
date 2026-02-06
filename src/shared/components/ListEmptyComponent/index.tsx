import React, { FC } from "react";
import EmptyList from "../EmptyList";
import { ActivityIndicator } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Skeleton from "../Skeleton";

type ListEmptyComponentProps = {
  isLoading?: boolean;
  LoadingComponent?: JSX.Element;
  EmptyStateComponent?: JSX.Element | null;
  disabled?: boolean;
};

const ListEmptyComponent: FC<ListEmptyComponentProps> = (props) => {
  const {
    isLoading,
    LoadingComponent,
    disabled = false,
    EmptyStateComponent,
  } = props;

  if (disabled) return null;

  if (isLoading) {
    if (LoadingComponent) return LoadingComponent;

    return (
      <View style={styles.skeletonList}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.skeletonCard}>
            <Skeleton height={120} radius={16} />
            <Skeleton height={14} width="60%" style={styles.skeletonLine} />
            <Skeleton height={12} width="40%" style={styles.skeletonLine} />
          </View>
        ))}
      </View>
    );
  }

  if (EmptyStateComponent) {
    return (
      <View style={styles.emptyStateContainer}>{EmptyStateComponent}</View>
    );
  }

  return (
    <View style={styles.emptyStateContainer}>
      <EmptyList />
    </View>
  );
};
const styles = StyleSheet.create({
  emptyStateContainer: {
    padding: 24,
  },
  skeletonList: {
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 8,
  },
  skeletonCard: {
    gap: 10,
  },
  skeletonLine: {
    marginTop: 8,
  },
  loader: {
    alignSelf: "center",
    top: 30,
  },
});

export default ListEmptyComponent;
