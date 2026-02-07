import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { executeVoid } from "@shared/local/db";

type Variables = {
  input: {
    name: string;
    quantity: number;
    unit?: string | null;
    type?: string | null;
  };
};

// Stock minimal en local : on insère dans feedings avec reptile_id "stock" (sentinel)
const useAddFoodStockMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (variables: Variables) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      await executeVoid(
        `INSERT INTO feedings (id, reptile_id, food_name, quantity, unit, type, fed_at, notes)
         VALUES (?,?,?,?,?,?,?,?);`,
        [
          id,
          "stock",
          variables.input.name,
          variables.input.quantity,
          variables.input.unit ?? null,
          variables.input.type ?? null,
          new Date().toISOString(),
          "stock entry",
        ],
      );
      return { id };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QueriesKeys.REPTILE_FEEDINGS] });
    },
  });
};

export default useAddFoodStockMutation;
