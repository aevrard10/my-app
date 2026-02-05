import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type DeleteReptileEventMutation = {
  deleteReptileEvent: {
    success: boolean;
    message: string;
  };
};

type DeleteReptileEventMutationVariables = {
  id: string;
};

const mutation = gql`
  mutation DeleteReptileEventMutation($id: ID!) {
    deleteReptileEvent(id: $id) {
      success
      message
    }
  }
`;

const useDeleteReptileEventMutation = () => {
  return useMutation<
    DeleteReptileEventMutation,
    DeleteReptileEventMutationVariables
  >({
    mutation,
  });
};

export default useDeleteReptileEventMutation;
