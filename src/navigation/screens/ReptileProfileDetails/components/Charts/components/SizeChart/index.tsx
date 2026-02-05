import { FC } from "react";
import { Platform, View, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";

type SizeChartProps = {
  data: any;
  isPending: boolean;
};
const SizeChart: FC<SizeChartProps> = (props) => {
  const { data, isPending } = props;
  const { colors } = useTheme();
  if (isPending) {
    return <ActivityIndicator animating={true} />;
  }
  return (
    <CardSurface style={styles.card}>
      <Text variant="titleSmall" style={styles.title}>
        Taille du reptile
      </Text>
      <LineChart
        areaChart
        data={data}
        rotateLabel
        width={Dimensions.get("window").width - 40}
        hideDataPoints
        spacing={10}
        color={colors.secondary}
        thickness={2}
        startFillColor="rgba(110,143,106,0.35)"
        endFillColor="rgba(110,143,106,0.05)"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={6}
        maxValue={130}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="solid"
        rulesColor="gray"
        yAxisTextStyle={{ color: "gray" }}
        yAxisSide="right"
        xAxisColor="lightgray"
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: "rgba(0,0,0,0.2)",
          pointerStripWidth: 2,
          pointerColor: "rgba(0,0,0,0.2)",
          radius: 6,
          pointerLabelWidth: 10,
          pointerLabelHeight: 9,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: (items) => {
            return (
              <View
                style={{
                  height: 90,
                  width: 100,
                  justifyContent: "center",
                  marginTop: -30,
                  marginLeft: -40,
                }}
              >
                <Text variant="bodySmall" style={styles.pointerDate}>
                  {items[0].date}
                </Text>

                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 16,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text variant="bodySmall" style={styles.pointerValue}>
                    {items[0].value + " " + items[0].size_mesure}
                  </Text>
                </View>
              </View>
            );
          },
        }}
      />
    </CardSurface>
  );
};

export default SizeChart;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 6,
  },
  pointerDate: {
    textAlign: "center",
    marginBottom: 6,
  },
  pointerValue: {
    textAlign: "center",
    fontWeight: "700",
  },
});
