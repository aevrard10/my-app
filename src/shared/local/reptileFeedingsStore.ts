import { execute, executeVoid } from "./db";
import { ListOptions } from "./storageAdapter";

export type LocalReptileFeeding = {
  id: string;
  reptile_id: string;
  food_name?: string | null;
  quantity?: number | null;
  unit?: string | null;
  fed_at: string;
  notes?: string | null;
  created_at: string;
};

const mapRow = (row: any): LocalReptileFeeding => ({ ...row });

export const getReptileFeedings = async (
  reptileId: string,
  options: ListOptions = { limit: 50, offset: 0 },
): Promise<LocalReptileFeeding[]> => {
  const { limit = 50, offset = 0 } = options;
  const rows = await execute(
    `SELECT * FROM feedings WHERE reptile_id = ? ORDER BY fed_at DESC LIMIT ? OFFSET ?;`,
    [reptileId, limit, offset],
  );
  return rows.map(mapRow);
};

export const addReptileFeeding = async (
  input: Omit<LocalReptileFeeding, "id" | "created_at">,
): Promise<LocalReptileFeeding> => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await executeVoid(
    `INSERT INTO feedings (id, reptile_id, food_name, quantity, unit, fed_at, notes)
     VALUES (?,?,?,?,?,?,?);`,
    [
      id,
      input.reptile_id,
      input.food_name ?? null,
      input.quantity ?? null,
      input.unit ?? null,
      input.fed_at,
      input.notes ?? null,
    ],
  );
  const rows = await execute("SELECT * FROM feedings WHERE id=?;", [id]);
  return mapRow(rows[0]);
};

export const deleteReptileFeeding = async (
  id: string,
): Promise<void> => {
  await executeVoid("DELETE FROM feedings WHERE id = ?;", [id]);
};
