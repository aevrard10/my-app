import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  ReptileQuery,
  ReptileQueryVariables,
} from "@shared/graphql/utils/types/types.generated";
import QueriesKeys from "@shared/declarations/queriesKeys";

const query = gql`
  query ReptileQuery($id: ID!) {
    reptile(id: $id) {
      id
      name
      species
      age
      last_fed
      notes
      image_url
      sort_of_species
      feeding_schedule
      diet
      humidity_level
      temperature_range
      health_status
      acquired_date
      origin
      location
    }
  }
`;
const queryKey = (id: string) => [QueriesKeys.REPTILE, id];

const useReptileQuery = Object.assign(
  (id: string) => {
    return useQuery<
      ReptileQuery,
      ReptileQueryVariables,
      ReptileQuery["reptile"]
    >({
      queryKey: queryKey(id), //TODO: add id in queryKey
      query,
      variables: { id },
      options: {
        select: (data) => data?.reptile,
      },
    });
  },
  { query, queryKey }
);

export default useReptileQuery;
