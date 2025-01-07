import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
} from "@shared/graphql/utils/types/types.generated";
import QueriesKeys from "@shared/declarations/queriesKeys";

const query = gql`
  query GetNotificationsQuery {
    getNotifications {
      id
      user_id
      message
      sent
      read
      created_at
      sent_at
    }
  }
`;
const queryKey = [QueriesKeys.GET_NOTIFICATIONS];

// Modified hook with transformation logic
const useGetNotificationsQuery = Object.assign(
  () => {
    return useQuery<
      GetNotificationsQuery,
      GetNotificationsQueryVariables,
      GetNotificationsQuery["getNotifications"]
    >({
      queryKey,
      query,
      options: {
        select: (data) => {
          return data?.getNotifications;
        },
      },
    });
  },
  { query, queryKey }
);

export default useGetNotificationsQuery;
