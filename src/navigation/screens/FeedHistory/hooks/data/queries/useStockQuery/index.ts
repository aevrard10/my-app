import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { FoodStockHistoryQuery, FoodStockHistoryQueryVariables } from "@shared/graphql/utils/types/types.generated";


const query = gql`
  query FoodStockHistoryQuery {
    foodStockHistory {
      id
      food_id
      quantity_change
      reason
      date
    }
  }
`;
const queryKey = [QueriesKeys.FEED_HISTORY];

const useFoodStockHistoryQuery = Object.assign(
  () => {
    return useQuery<
      FoodStockHistoryQuery,
      FoodStockHistoryQueryVariables,
      FoodStockHistoryQuery["foodStockHistory"]
    >({
      queryKey, //TODO: add id in queryKey
      query,
      options: {
        select: (data) => data?.foodStockHistory|| [],
      },
    });
  },
  { query, queryKey }
);

export default useFoodStockHistoryQuery;
