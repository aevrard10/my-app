import { FC } from "react";
import { Platform, View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ActivityIndicator, Card } from "react-native-paper";

type GraphicChartProps = {
  data: any;
  isPending: boolean;
};
const GraphicChart: FC<GraphicChartProps> = (props) => {
  const { data, isPending } = props;
  if (isPending) {
    return <ActivityIndicator animating={true} />;
  }
  return (
    <Card
      style={[
        {
          paddingVertical: 20,
        },
        Platform.select({
          web: {
            justifyContent: "center",
            marginHorizontal: 20,
            overflow: "hidden",
          },
          default: {
            marginHorizontal: 20,
            overflow: "hidden",
          },
        }),
      ]}
    >
      <Text
        style={{
          fontSize: 14,
          color: "black",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Poids du reptile
      </Text>
      <LineChart
        areaChart
        data={data}
        rotateLabel
        width={Dimensions.get("window").width - 40}
        hideDataPoints
        spacing={10}
        color="#00ff83"
        thickness={2}
        startFillColor="rgba(20,105,81,0.3)"
        endFillColor="rgba(20,85,81,0.01)"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={6}
        maxValue={60}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="solid"
        rulesColor="gray"
        yAxisTextStyle={{ color: "gray" }}
        yAxisSide="right"
        xAxisColor="lightgray"
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: "lightgray",
          pointerStripWidth: 2,
          pointerColor: "lightgray",
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
                <Text
                  style={{
                    color: "black",
                    fontSize: 14,
                    marginBottom: 6,
                    textAlign: "center",
                  }}
                >
                  {items[0].date}
                </Text>

                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 16,
                    backgroundColor: "white",
                  }}
                >
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {items[0].value + " " + items[0].weight_mesure}
                  </Text>
                </View>
              </View>
            );
          },
        }}
      />
    </Card>
  );
};

export default GraphicChart;
