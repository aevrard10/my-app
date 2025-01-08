import { FC } from "react";
import { View, Text, Platform } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Surface } from "react-native-paper";

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
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Surface
        style={{
          margin: 10,
          padding: 16,
          borderRadius: 20,
          backgroundColor: "#232B5D",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Temperature
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
                    {temperature ?? ""}°C
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </Surface>
    </View>
  );
};

export default TemperatureChart;
