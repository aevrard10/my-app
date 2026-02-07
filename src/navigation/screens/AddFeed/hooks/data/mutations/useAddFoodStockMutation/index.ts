import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { executeVoid } from "@shared/local/db";
import {
  getFoodAliases,
  getFoodTypeKeyFromFood,
  normalizeFoodName,
  normalizeFoodType,
} from "@shared/constants/foodCatalog";

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
      const rawName = variables.input.name;
      const canonicalName = normalizeFoodName(rawName);
      const derivedType =
        normalizeFoodType(variables.input.type) ||
        getFoodTypeKeyFromFood(canonicalName) ||
        "other";
      const aliases = getFoodAliases(canonicalName);
      if (aliases.length) {
        const placeholders = aliases.map(() => "?").join(",");
        await executeVoid(
          `UPDATE feedings
           SET food_name = ?, type = ?
           WHERE reptile_id = 'stock' AND LOWER(food_name) IN (${placeholders});`,
          [canonicalName, derivedType, ...aliases.map((a) => a.toLowerCase())],
        );
      }
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      await executeVoid(
        `INSERT INTO feedings (id, reptile_id, food_name, quantity, unit, type, fed_at, notes)
         VALUES (?,?,?,?,?,?,?,?);`,
        [
          id,
          "stock",
          canonicalName,
          variables.input.quantity,
          variables.input.unit ?? null,
          derivedType ?? null,
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
