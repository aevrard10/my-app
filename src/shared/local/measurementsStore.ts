import { execute, executeVoid } from "./db";
import { ListOptions } from "./storageAdapter";

export type LocalMeasurement = {
  id: string;
  reptile_id: string;
  date: string;
  weight?: number | null;
  size?: number | null;
  size_mesure?: string | null;
  weight_mesure?: string | null;
};

const mapRow = (row: any): LocalMeasurement => ({ ...row });

export const getMeasurements = async (
  reptileId: string,
  options: ListOptions = { limit: 100, offset: 0 },
): Promise<LocalMeasurement[]> => {
  const { limit = 100, offset = 0 } = options;
  const rows = await execute(
    `SELECT * FROM measurements WHERE reptile_id = ? ORDER BY date DESC LIMIT ? OFFSET ?;`,
    [reptileId, limit, offset],
  );
  return rows.map(mapRow);
};

export const addMeasurement = async (
  input: Omit<LocalMeasurement, "id">,
): Promise<LocalMeasurement> => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await executeVoid(
    `INSERT INTO measurements (id, reptile_id, date, weight, size, size_mesure, weight_mesure)
     VALUES (?,?,?,?,?,?,?);`,
    [
      id,
      input.reptile_id,
      input.date,
      input.weight ?? null,
      input.size ?? null,
      input.size_mesure ?? null,
      input.weight_mesure ?? null,
    ],
  );
  const rows = await execute("SELECT * FROM measurements WHERE id = ?;", [id]);
  return mapRow(rows[0]);
};
