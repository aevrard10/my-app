import useMutation from "@shared/graphql/useMutation";
import {
  AddMeasurementMutation,
  AddMeasurementMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";

const mutation = gql`
  mutation AddMeasurementMutation($input: AddMeasurementInput!) {
    addMeasurement(input: $input) {
      id
    }
  }
`;
const useAddMeasurementMutation = () => {
  return useMutation<AddMeasurementMutation, AddMeasurementMutationVariables>({
    mutation,
  });
};

export default useAddMeasurementMutation;
