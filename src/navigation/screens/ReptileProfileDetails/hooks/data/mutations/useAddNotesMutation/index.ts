import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReptileFields } from "@shared/local/reptileStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useAddNotesMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string; notes: string }) => {
      return updateReptileFields(variables.id, { notes: variables.notes });
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [QueriesKeys.REPTILE, variables.id] });
      qc.invalidateQueries({ queryKey: [QueriesKeys.REPTILES] });
    },
  });
};

export default useAddNotesMutation;
