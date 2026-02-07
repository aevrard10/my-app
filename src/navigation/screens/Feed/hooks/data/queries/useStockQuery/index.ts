import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { execute } from "@shared/local/db";
import {
  getFoodTypeKeyFromFood,
  normalizeFoodType,
} from "@shared/constants/foodCatalog";

type StockItem = {
  id: string;
  name: string;
  quantity: number;
  unit?: string | null;
  last_updated?: string | null;
  type?: string | null;
};

const queryKey = [QueriesKeys.STOCK];

const useFoodQuery = Object.assign(
  () =>
    useQuery<StockItem[]>({
      queryKey,
      queryFn: async () => {
        const rows = await execute(
          `SELECT food_name as name,
                  IFNULL(SUM(quantity),0) as quantity,
                  MAX(fed_at) as last_updated,
                  MAX(type) as type,
                  MAX(unit) as unit
           FROM feedings
           WHERE reptile_id = 'stock'
           GROUP BY food_name
           ORDER BY last_updated DESC;`,
        );
        return rows.map((r: any) => ({
          id: `${r.name}`,
          name: r.name,
          quantity: r.quantity,
          unit: r.unit ?? null,
          type:
            normalizeFoodType(r.type) ||
            getFoodTypeKeyFromFood(r.name) ||
            r.type ||
            null,
          last_updated: r.last_updated,
        }));
      },
    }),
  { queryKey },
);

export default useFoodQuery;
