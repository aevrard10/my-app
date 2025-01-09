import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  MeasurementsQuery,
  MeasurementsQueryVariables,
} from "@shared/graphql/utils/types/types.generated";
import QueriesKeys from "@shared/declarations/queriesKeys";

const query = gql`
  query MeasurementsQuery($reptileId: ID!) {
    measurements(reptile_id: $reptileId) {
      id
      reptile_id
      date
      weight
      size
      size_mesure
      weight_mesure
    }
  }
`;
const queryKey = [QueriesKeys.MESUAREMENTS];

const useMeasurementsQuery = Object.assign(
  (id: string) => {
    return useQuery<
      MeasurementsQuery,
      MeasurementsQueryVariables,
      MeasurementsQuery["measurements"]
    >({
      queryKey, //TODO: add id in queryKey
      query,
      variables: { reptileId: id },
      options: {
        select: (data) => data?.measurements || [],
      },
    });
  },
  { query, queryKey }
);

export default useMeasurementsQuery;
