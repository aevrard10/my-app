import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type DeleteReptilePhotoMutation = {
  deleteReptilePhoto: {
    success: boolean;
    message: string;
  };
};

type DeleteReptilePhotoMutationVariables = {
  id: string;
};

const mutation = gql`
  mutation DeleteReptilePhotoMutation($id: ID!) {
    deleteReptilePhoto(id: $id) {
      success
      message
    }
  }
`;

const useDeleteReptilePhotoMutation = () => {
  return useMutation<
    DeleteReptilePhotoMutation,
    DeleteReptilePhotoMutationVariables
  >({
    mutation,
  });
};

export default useDeleteReptilePhotoMutation;
