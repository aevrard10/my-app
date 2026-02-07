import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { execute } from "@shared/local/db";

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
                  unit,
                  type,
                  MAX(fed_at) as last_updated
           FROM feedings
           WHERE reptile_id = 'stock'
           GROUP BY food_name, unit, type
           ORDER BY last_updated DESC;`,
        );
        return rows.map((r: any) => ({
          id: `${r.name}-${r.unit || ""}-${r.type || ""}`,
          name: r.name,
          quantity: r.quantity,
          unit: r.unit,
          type: r.type ?? null,
          last_updated: r.last_updated,
        }));
      },
    }),
  { queryKey },
);

export default useFoodQuery;
