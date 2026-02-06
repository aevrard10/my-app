import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertReptile, UpsertReptileInput } from "@shared/local/reptileStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useAddReptilesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { input: UpsertReptileInput }) => {
      return await upsertReptile(variables.input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILES] });
    },
  });
};

export default useAddReptilesMutation;
