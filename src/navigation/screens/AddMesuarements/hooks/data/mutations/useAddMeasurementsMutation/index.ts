import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMeasurement } from "@shared/local/measurementsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

type AddMeasurementVariables = {
  input: {
    reptile_id: string;
    date: string;
    weight?: number;
    size?: number;
    size_mesure?: string;
    weight_mesure?: string;
  };
};

const useAddMeasurementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: AddMeasurementVariables) =>
      addMeasurement({
        reptile_id: variables.input.reptile_id,
        date: variables.input.date,
        weight: variables.input.weight,
        size: variables.input.size,
        size_mesure: variables.input.size_mesure,
        weight_mesure: variables.input.weight_mesure,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueriesKeys.MESUAREMENTS, variables.input.reptile_id],
      });
    },
  });
};

export default useAddMeasurementMutation;
