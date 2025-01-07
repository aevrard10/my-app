import useMutation from "@shared/graphql/useMutation";
import {
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadMutationVariables,
} from "@shared/graphql/utils/types/types.generated";

import { gql } from "graphql-request";
const mutation = gql`
  mutation MarkNotificationAsReadMutation($id: Int!) {
    markNotificationAsRead(id: $id) {
      read
    }
  }
`;
const useMarkNotificationAsReadMutationMutation = () => {
  return useMutation<
    MarkNotificationAsReadMutation,
    MarkNotificationAsReadMutationVariables
  >({
    mutation,
  });
};

export default useMarkNotificationAsReadMutationMutation;
