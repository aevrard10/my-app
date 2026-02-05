import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";

type AgendaItemProps = {
  item: {
    name: string;
    time: string;
    notes: string;
  };
};

const AgendaItem: FC<AgendaItemProps> = (props) => {
  const { item } = props;
  const { colors } = useTheme();

  return (
    <CardSurface style={styles.card}>
      <View style={styles.row}>
        <View
          style={[styles.dot, { backgroundColor: colors.primary }]}
        />
        <Text style={styles.title} numberOfLines={1} variant="titleMedium">
          {item?.name}
        </Text>
        <Text style={styles.time} variant="labelSmall">
          {item?.time}
        </Text>
      </View>
      <Text numberOfLines={2} style={styles.notes}>
        {item?.notes}
      </Text>
    </CardSurface>
  );
};

export default AgendaItem;

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    paddingVertical: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    flex: 1,
  },
  time: {
    opacity: 0.7,
  },
  notes: {
    opacity: 0.7,
  },
});
