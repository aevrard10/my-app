import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme, Avatar } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";

type AgendaItemProps = {
  item: {
    name: string;
    time: string;
    notes: string;
    reptile_name?: string | null;
    reptile_image_url?: string | null;
  };
};

const AgendaItem: FC<AgendaItemProps> = (props) => {
  const { item } = props;
  const { colors } = useTheme();

  const timeLabel = item?.time?.trim() ? item.time : "—";

  return (
    <CardSurface style={styles.card}>
      <View style={styles.row}>
        {item.reptile_image_url ? (
          <Avatar.Image size={40} source={{ uri: item.reptile_image_url }} />
        ) : (
          <Avatar.Icon size={40} icon="turtle" />
        )}
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1} variant="titleMedium">
            {item?.name}
          </Text>
          {item?.reptile_name ? (
            <Text numberOfLines={1} style={styles.notesInline} variant="labelSmall">
              {item.reptile_name}
            </Text>
          ) : null}
        </View>
        <View
          style={[
            styles.timePill,
            { backgroundColor: colors.secondaryContainer },
          ]}
        >
          <Text variant="labelSmall" style={[styles.timeText, { color: colors.secondary }]}>
            {timeLabel}
          </Text>
        </View>
      </View>
      {item?.notes ? (
        <Text numberOfLines={2} style={styles.notes}>
          {item.notes}
        </Text>
      ) : null}
    </CardSurface>
  );
};

export default AgendaItem;

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {},
  timePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  timeText: {
    letterSpacing: 0.2,
  },
  notes: {
    opacity: 0.65,
    marginTop: 8,
  },
  notesInline: {
    opacity: 0.6,
  },
});
