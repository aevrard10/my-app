import { View } from "react-native"
import TemperatureChart from "./components/TemperatureChart"
import HumidityChart from "./components/HumidityChart"
import GraphicChart from "./components/GraphicChart"
import SizeChart from "./components/SizeChart"
import { FC } from "react"
type ChartsProps = {
    data: {
        temperature_range: number,
        humidity_level: number
    },
    measurements: {
        date: string,
        weight: number,
        weight_mesure: string,
        size: number,
        size_mesure: string
    }[],
    isPending: boolean
}

const Charts:FC<ChartsProps> = (props) => {
    const { data, measurements, isPending } = props
    return (
        <>
        <View style={{ flexDirection: "row" }}>
        <TemperatureChart
          data={[
            {
              value: data?.temperature_range || "0",
              color:
                data?.temperature_range > 30
                  ? data?.temperature_range > 30
                    ? "#FF7F97"
                    : "#3BE9DE"
                  : "#3BE9DE",
              gradientCenterColor:
                data?.temperature_range > 30
                  ? data?.temperature_range > 30
                    ? "#FF7F97"
                    : "#006DFF"
                  : "#006DFF",
              focused: true,
            },
          ]}
          temperature={data?.temperature_range || ""}
        />
        <HumidityChart
          data={[
            {
              value: data?.temperature_range || "",
              color:
                data?.humidity_level > 30
                  ? data?.humidity_level > 30
                    ? "#FF7F97"
                    : "#3BE9DE"
                  : "#3BE9DE",
              gradientCenterColor: "#006DFF",
              focused: true,
            },
          ]}
          humidity={data?.humidity_level || ""}
        />
      </View>
      <View style={{ gap: 10 }}>
        <GraphicChart
          data={measurements?.map((m) => ({
            date: m.date,
            value: m.weight,
            weight_mesure: m.weight_mesure,
          }))}
          isPending={isPending}
        />
        <SizeChart
          data={measurements?.map((m) => ({
            date: m.date,
            value: m.size,
            size_mesure: m.size_mesure,
          }))}
          isPending={isPending}
        />
      </View>
      </>
    )

}

export default Charts;