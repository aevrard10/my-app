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
      queryKey,
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
