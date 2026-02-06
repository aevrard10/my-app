import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReptileShed } from "@shared/local/reptileShedsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

type AddReptileShedVariables = {
  input: {
    reptile_id: string;
    shed_date: string;
    notes?: string;
  };
};

const useAddReptileShedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: AddReptileShedVariables) =>
      addReptileShed({
        reptile_id: variables.input.reptile_id,
        shed_date: variables.input.shed_date,
        notes: variables.input.notes,
        created_at: new Date().toISOString(),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueriesKeys.REPTILE_SHEDS, variables.input.reptile_id],
      });
    },
  });
};

export default useAddReptileShedMutation;
