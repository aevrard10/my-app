import useMutation from "@shared/graphql/useMutation";
import {
  UpdateFoodStockMutation,
  UpdateFoodStockMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";

const mutation = gql`
  mutation UpdateFoodStockMutation($input: UpdateFoodStockInput!) {
    updateFoodStock(input: $input) {
      success
        message
    }
  }
`;
const useUpdateFoodStock = () => {
  return useMutation<UpdateFoodStockMutation, UpdateFoodStockMutationVariables>({
    mutation,
  });
};

export default useUpdateFoodStock;
