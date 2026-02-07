import ScreenNames from "@shared/declarations/screenNames";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { useI18n } from "@shared/i18n";

type HistoryChipProps = {
  navigate: (screenName: string) => void;
  colors: ThemeProp["colors"];
};
const HistoryChip: FC<HistoryChipProps> = (props) => {
  const { navigate, colors } = props;
  const { t } = useI18n();
  return (
    <View style={styles.chipContainer}>
      <Chip
        onPress={() => navigate(ScreenNames.FEED_HISTORY)}
        icon="food-fork-drink"
        style={[styles.chip, { backgroundColor: colors?.primary }]}
        textStyle={styles.textStyle}
      >
        {t("feed.history_chip")}
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
