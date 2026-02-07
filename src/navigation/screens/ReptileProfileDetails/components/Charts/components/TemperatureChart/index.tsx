import { FC } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Text, useTheme } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";

type TemperatureChartProps = {
  data: {
    value: string;
    color: string;
    gradientCenterColor: string;
    focused: boolean;
  };
  temperature: string;
};
const TemperatureChart: FC<TemperatureChartProps> = (props) => {
  const { data, temperature } = props;
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <View style={styles.wrapper}>
      <CardSurface style={styles.card}>
        <Text variant="titleSmall">{t("chart.temperature")}</Text>
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
                    {temperature ?? ""}°C
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

export default TemperatureChart;

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
