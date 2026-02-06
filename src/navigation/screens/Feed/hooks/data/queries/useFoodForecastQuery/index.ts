import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

export type FoodStockForecast = {
  food_id: number;
  name: string;
  unit: string;
  quantity: number;
  daily_consumption: number;
  projected_remaining_14: number;
  projected_remaining_30: number;
};

type FoodForecastResponse = {
  foodStockForecast: FoodStockForecast[];
};

const query = gql`
  query FoodStockForecast($days: Int!) {
    foodStockForecast(days: $days) {
      food_id
      name
      unit
      quantity
      daily_consumption
      projected_remaining_14
      projected_remaining_30
    }
  }
`;

const useFoodForecastQuery = (days: number) =>
  useQuery<FoodForecastResponse, { days: number }, FoodStockForecast[]>({
    queryKey: [QueriesKeys.FEED_FORECAST, days],
    query,
    variables: { days },
    options: {
      select: (data) => data?.foodStockForecast ?? [],
    },
  });

export default useFoodForecastQuery;
