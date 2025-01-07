import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  MeasurementsQuery,
  MeasurementsQueryVariables,
} from "@shared/graphql/utils/types/types.generated";

const query = gql`
  query MeasurementsQuery($reptileId: ID!) {
    measurements(reptile_id: $reptileId) {
      id
      reptile_id
      date
      weight
      size
    }
  }
`;
const queryKey = ["measurements"];

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
        select: (data) =>
          data?.measurements?.map((m) => ({
            date: m.date,
            value: m.weight,
          })),
      },
    });
  },
  { query, queryKey }
);

export default useMeasurementsQuery;
