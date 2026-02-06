import { execute, executeVoid } from "./db";
import { ListOptions } from "./storageAdapter";

export type LocalReptileShed = {
  id: string;
  reptile_id: string;
  shed_date: string;
  notes?: string | null;
  created_at: string;
};

const mapRow = (row: any): LocalReptileShed => ({ ...row });

export const getReptileSheds = async (
  reptileId: string,
  options: ListOptions = { limit: 50, offset: 0 },
): Promise<LocalReptileShed[]> => {
  const { limit = 50, offset = 0 } = options;
  const rows = await execute(
    `SELECT * FROM sheds WHERE reptile_id = ? ORDER BY shed_date DESC LIMIT ? OFFSET ?;`,
    [reptileId, limit, offset],
  );
  return rows.map(mapRow);
};

export const addReptileShed = async (
  input: Omit<LocalReptileShed, "id" | "created_at">,
): Promise<LocalReptileShed> => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await executeVoid(
    `INSERT INTO sheds (id, reptile_id, shed_date, notes) VALUES (?,?,?,?);`,
    [id, input.reptile_id, input.shed_date, input.notes ?? null],
  );
  const rows = await execute("SELECT * FROM sheds WHERE id = ?;", [id]);
  return mapRow(rows[0]);
};

export const deleteReptileShed = async (id: string): Promise<void> => {
  await executeVoid("DELETE FROM sheds WHERE id = ?;", [id]);
};
