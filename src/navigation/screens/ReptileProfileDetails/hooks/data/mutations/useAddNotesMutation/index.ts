import useMutation from "@shared/graphql/useMutation";
import {
  AddNotesMutation,
  AddNotesMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";

const mutation = gql`
  mutation AddNotesMutation($id: ID!, $notes: String!) {
    addNotes(id: $id, notes: $notes) {
      success
      message
    }
  }
`;
const useAddNotesMutation = () => {
  return useMutation<AddNotesMutation, AddNotesMutationVariables>({
    mutation,
  });
};

export default useAddNotesMutation;
