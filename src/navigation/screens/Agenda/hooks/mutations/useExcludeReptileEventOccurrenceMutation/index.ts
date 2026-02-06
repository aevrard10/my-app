import { useMutation, useQueryClient } from "@tanstack/react-query";
import { excludeReptileEventOccurrence } from "@shared/local/reptileEventsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

type ExcludeReptileEventOccurrenceVariables = {
  id: string;
  date: string;
};

const useExcludeReptileEventOccurrenceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: ExcludeReptileEventOccurrenceVariables) =>
      excludeReptileEventOccurrence(variables.id, variables.date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILES_EVENTS] });
    },
  });
};

export default useExcludeReptileEventOccurrenceMutation;
