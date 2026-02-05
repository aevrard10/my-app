import ScreenNames from "@shared/declarations/screenNames";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

type HistoryChipProps = {
  navigate: (screenName: string) => void;
  colors: ThemeProp["colors"];
};
const HistoryChip: FC<HistoryChipProps> = (props) => {
  const { navigate, colors } = props;
  return (
    <View style={styles.chipContainer}>
      <Chip
        onPress={() => navigate(ScreenNames.FEED_HISTORY)}
        icon="food-fork-drink"
        style={[styles.chip, { backgroundColor: colors?.primary }]}
        textStyle={styles.textStyle}
      >
        Historique des stocks
      </Chip>
    </View>
  );
};
const styles = StyleSheet.create({
  chipContainer: { flexDirection: "row", justifyContent: "space-between" },
  chip: {
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  textStyle: { color: "#fff", fontWeight: "bold" },
});
export default HistoryChip;
