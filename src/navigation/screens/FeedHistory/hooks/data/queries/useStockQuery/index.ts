import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { execute } from "@shared/local/db";

type StockHistoryItem = {
  id: string;
  date: string;
  reason: string;
  quantity_change: number;
  unit?: string | null;
  type?: string | null;
};

const queryKey = [QueriesKeys.STOCK_HISTORY];

const useFoodStockHistoryQuery = Object.assign(
  () =>
    useQuery<StockHistoryItem[]>({
      queryKey,
      queryFn: async () => {
        const rows = await execute(
          `SELECT id,
                  fed_at AS date,
                  food_name AS reason,
                  quantity AS quantity_change,
                  unit,
                  type
           FROM feedings
           WHERE reptile_id = 'stock'
           ORDER BY fed_at DESC
           LIMIT 500;`,
        );
        return rows as StockHistoryItem[];
      },
      staleTime: 1000 * 60 * 5,
    }),
  { queryKey },
);

export default useFoodStockHistoryQuery;
