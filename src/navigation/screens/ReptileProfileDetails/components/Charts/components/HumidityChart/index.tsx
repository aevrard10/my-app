import { FC } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Text, useTheme } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";

type HumidityChartProps = {
  data: {
    value: string;
    color: string;
    gradientCenterColor: string;
    focused: boolean;
  };
  humidity: string;
};
const HumidityChart: FC<HumidityChartProps> = (props) => {
  const { data, humidity } = props;
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <View style={styles.wrapper}>
      <CardSurface style={styles.card}>
        <Text variant="titleSmall">{t("chart.humidity")}</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={data}
            donut
            showGradient
            sectionAutoFocus
            radius={Platform.select({
              web: 90,
              default: 40,
            })}
            innerRadius={Platform.select({
              web: 60,
              default: 30,
            })}
            innerCircleColor={colors.surface}
            centerLabelComponent={() => {
              return (
                <View style={styles.centerLabel}>
                  <Text variant="titleMedium">
                    {humidity ?? ""}%
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </CardSurface>
    </View>
  );
};

export default HumidityChart;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    marginVertical: 8,
  },
  chartContainer: {
    padding: 16,
    alignItems: "center",
  },
  centerLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
});
