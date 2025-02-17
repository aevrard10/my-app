import useMutation from "@shared/graphql/useMutation";
import { LastFedUpdateMutation, LastFedUpdateMutationVariables } from "@shared/graphql/utils/types/types.generated";

import { gql } from "graphql-request";

const mutation = gql`
  mutation LastFedUpdateMutation($id: ID!, $last_fed: String!) {
    lastFedUpdate(id: $id, last_fed: $last_fed) {
      success
      message
    }
  }
`;
const useLastFedUpdateMutation = () => {
  return useMutation<LastFedUpdateMutation, LastFedUpdateMutationVariables>({
    mutation,
  });
};

export default useLastFedUpdateMutation;
