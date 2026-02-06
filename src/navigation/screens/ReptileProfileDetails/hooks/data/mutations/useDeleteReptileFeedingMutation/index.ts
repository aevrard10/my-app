import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type DeleteReptileFeedingMutation = {
  deleteReptileFeeding: {
    success: boolean;
    message: string;
  };
};

type DeleteReptileFeedingVariables = {
  id: string;
};

const mutation = gql`
  mutation DeleteReptileFeedingMutation($id: ID!) {
    deleteReptileFeeding(id: $id) {
      success
      message
    }
  }
`;

const useDeleteReptileFeedingMutation = () => {
  return useMutation<
    DeleteReptileFeedingMutation,
    DeleteReptileFeedingVariables
  >({
    mutation,
  });
};

export default useDeleteReptileFeedingMutation;
