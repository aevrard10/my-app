import React, { FC } from "react";
import EmptyList from "../EmptyList";
import { ActivityIndicator } from "react-native-paper";
import { StyleSheet, View } from "react-native";

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

    return <ActivityIndicator style={styles.loader} />;
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
  loader: {
    alignSelf: "center",
    top: 30,
  },
});

export default ListEmptyComponent;
