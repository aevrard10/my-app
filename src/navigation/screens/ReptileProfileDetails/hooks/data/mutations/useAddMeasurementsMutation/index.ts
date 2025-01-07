import useMutation from "@shared/graphql/useMutation";
import {
  AddMeasurementInput,
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
  return useMutation<AddMeasurementInput, AddMeasurementMutationVariables>({
    mutation,
  });
};

export default useAddMeasurementMutation;
