import useMutation from "@shared/graphql/useMutation";
import {
 AddFoodStockMutation,
  AddFoodStockMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";

const mutation = gql`
  mutation AddFoodStockMutation($input: AddFoodStockInput!) {
    addFoodStock(input: $input) {
      id
    }
  }
`;
const useAddFoodStockMutation = () => {
  return useMutation<AddFoodStockMutation, AddFoodStockMutationVariables>({
    mutation,
  });
};

export default useAddFoodStockMutation;
