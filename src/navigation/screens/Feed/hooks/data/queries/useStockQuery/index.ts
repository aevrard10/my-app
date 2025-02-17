import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";
import {
  FoodStockQuery,
  FoodStockQueryVariables,
} from "@shared/graphql/utils/types/types.generated";

const query = gql`
  query FoodStockQuery {
    foodStock {
      id
      name
      quantity
      unit
      last_updated
      type
    }
  }
`;
const queryKey = [QueriesKeys.STOCK];

const useFoodQuery = Object.assign(
  () => {
    return useQuery<
      FoodStockQuery,
      FoodStockQueryVariables,
      FoodStockQuery["foodStock"]
    >({
      queryKey, //TODO: add id in queryKey
      query,
      options: {
        select: (data) => data?.foodStock || [],
      },
    });
  },
  { query, queryKey }
);

export default useFoodQuery;
