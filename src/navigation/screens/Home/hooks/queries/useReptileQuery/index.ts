import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  ReptileQuery,
  ReptileQueryVariables,
} from "@shared/graphql/utils/types/types.generated";

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
      lighting_requirements
      health_status
      last_vet_visit
      next_vet_visit
      medical_history {
        date
        diagnosis
        treatment
        vet_name
        notes
      }
      behavior_notes
      handling_notes
      acquired_date
      origin
      location
      enclosure {
        id
        type
        dimensions
        temperature
        humidity
        lighting
        notes
      }
    }
  }
`;
const queryKey = ["reptile"];

const useReptileQuery = Object.assign(
  (id: string) => {
    return useQuery<
      ReptileQuery,
      ReptileQueryVariables,
      ReptileQuery["reptile"]
    >({
      queryKey, //TODO: add id in queryKey
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
