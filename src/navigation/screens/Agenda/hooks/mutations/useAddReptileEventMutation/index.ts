import useMutation from "@shared/graphql/useMutation";
import {
  AddReptileEventMutation,
  AddReptileEventMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";
const mutation = gql`
  mutation addReptileEventMutation($input: AddReptileEventInput!) {
    addReptileEvent(input: $input) {
      event_name
    }
  }
`;
const useAddReptileEventMutation = () => {
  return useMutation<AddReptileEventMutation, AddReptileEventMutationVariables>(
    {
      mutation,
    }
  );
};

export default useAddReptileEventMutation;
