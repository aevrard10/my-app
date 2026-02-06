import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  upsertReptileGenetics,
  LocalReptileGenetics,
} from "@shared/local/reptileGeneticsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useUpsertReptileGeneticsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { input: Partial<LocalReptileGenetics> & { reptile_id: string } }) => {
      return await upsertReptileGenetics(variables.input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILE_GENETICS, variables.input.reptile_id] });
    },
  });
};

export default useUpsertReptileGeneticsMutation;
