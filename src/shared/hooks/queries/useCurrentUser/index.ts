import { gql } from "graphql-request";
import { assign } from "lodash";
import useCurrentTokenQuery from "../useCurrentTokenQuery";
import { GraphQLError } from "@shared/graphql/hooks/request/types";
import request from "@shared/graphql/hooks/request";
import QueriesKeys from "@shared/declarations/queriesKeys";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  CurrentUserQuery,
  CurrentUserQueryVariables,
} from "@shared/graphql/utils/types/types.generated";

const query = gql`
  query CurrentUserQuery {
    currentUser {
      id
      username
      email
    }
  }
`;

const queryKey = [QueriesKeys.CURRENT_USER];
const queryFn = async () => await request(query);

const useCurrentUserQuery = assign(
  () => {
    const [, token] = useCurrentTokenQuery();
    const { data, isPending, refetch, error, isFetched } = useQuery<
      CurrentUserQuery,
      CurrentUserQueryVariables,
      CurrentUserQuery["currentUser"]
    >({
      queryKey,
      query,
      options: { enabled: !!token, select: (data) => data.currentUser },
    });

    return [isPending, data, refetch, error, isFetched] as const;
  },
  {
    queryKey,
    queryFn,
    query,
  }
);

export default useCurrentUserQuery;
