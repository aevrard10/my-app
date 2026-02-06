import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertReptile, UpsertReptileInput } from "@shared/local/reptileStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useUpdateReptileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string; input: UpsertReptileInput }) => {
      return await upsertReptile(variables.input, variables.id);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILES] });
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILE, variables.id] });
    },
  });
};

export default useUpdateReptileMutation;
