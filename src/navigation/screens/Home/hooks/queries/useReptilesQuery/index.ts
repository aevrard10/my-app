import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  ReptilesQuery,
  ReptilesQueryVariables,
} from "@shared/graphql/utils/types/types.generated";

const query = gql`
  query ReptilesQuery {
    reptiles {
      id
      name
      species
      age
      last_fed
      image_url
    }
  }
`;
const queryKey = ["reptiles"];

const useReptilesQuery = Object.assign(
  () => {
    return useQuery<
      ReptilesQuery,
      ReptilesQueryVariables,
      ReptilesQuery["reptiles"]
    >({
      queryKey,
      query,
      options: {
        select: (data) => data?.reptiles,
      },
    });
  },
  { query, queryKey }
);

export default useReptilesQuery;
