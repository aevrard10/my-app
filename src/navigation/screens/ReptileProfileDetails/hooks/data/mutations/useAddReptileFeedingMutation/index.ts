import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReptileFeeding } from "@shared/local/reptileFeedingsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

type AddReptileFeedingVariables = {
  input: {
    reptile_id: string;
    food_name?: string;
    quantity?: number;
    unit?: string;
    fed_at: string;
    notes?: string;
  };
};

const useAddReptileFeedingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: AddReptileFeedingVariables) =>
      addReptileFeeding({
        reptile_id: variables.input.reptile_id,
        food_name: variables.input.food_name,
        quantity: variables.input.quantity,
        unit: variables.input.unit,
        fed_at: variables.input.fed_at,
        notes: variables.input.notes,
        created_at: new Date().toISOString(),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueriesKeys.REPTILE_FEEDINGS, variables.input.reptile_id],
      });
    },
  });
};

export default useAddReptileFeedingMutation;
