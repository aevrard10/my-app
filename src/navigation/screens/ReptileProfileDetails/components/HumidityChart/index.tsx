import { FC } from "react";
import { View, Text, Platform } from "react-native";
import { PieChart } from "react-native-gifted-charts";

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
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          margin: 10,
          padding: 16,
          borderRadius: 20,
          backgroundColor: "#232B5D",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Humidité
        </Text>
        <View style={{ padding: 20, alignItems: "center" }}>
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
            innerCircleColor={"#232B5D"}
            centerLabelComponent={() => {
              return (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
                  >
                    {humidity ?? ""}%
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default HumidityChart;
