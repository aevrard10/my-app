import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type DeleteReptileShedMutation = {
  deleteReptileShed: {
    success: boolean;
    message: string;
  };
};

type DeleteReptileShedVariables = {
  id: string;
};

const mutation = gql`
  mutation DeleteReptileShedMutation($id: ID!) {
    deleteReptileShed(id: $id) {
      success
      message
    }
  }
`;

const useDeleteReptileShedMutation = () => {
  return useMutation<
    DeleteReptileShedMutation,
    DeleteReptileShedVariables
  >({
    mutation,
  });
};

export default useDeleteReptileShedMutation;
