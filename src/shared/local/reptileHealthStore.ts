import { execute, executeVoid } from "./db";
import { ListOptions } from "./storageAdapter";

export type LocalReptileHealthEvent = {
  id: string;
  reptile_id: string;
  event_type: string;
  event_date: string;
  event_time?: string | null;
  notes?: string | null;
  created_at: string;
};

const mapRow = (row: any): LocalReptileHealthEvent => ({ ...row });

export const getReptileHealthEvents = async (
  reptileId: string,
  options: ListOptions = { limit: 50, offset: 0 },
): Promise<LocalReptileHealthEvent[]> => {
  const { limit = 50, offset = 0 } = options;
  const rows = await execute(
    `SELECT * FROM health_events
     WHERE reptile_id = ?
     ORDER BY event_date DESC, event_time DESC
     LIMIT ? OFFSET ?;`,
    [reptileId, limit, offset],
  );
  return rows.map(mapRow);
};

export const addReptileHealthEvent = async (
  input: Omit<LocalReptileHealthEvent, "id" | "created_at">,
): Promise<LocalReptileHealthEvent> => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await executeVoid(
    `INSERT INTO health_events (id, reptile_id, event_type, event_date, event_time, notes)
     VALUES (?,?,?,?,?,?);`,
    [
      id,
      input.reptile_id,
      input.event_type,
      input.event_date,
      input.event_time ?? null,
      input.notes ?? null,
    ],
  );
  const rows = await execute("SELECT * FROM health_events WHERE id = ?;", [id]);
  return mapRow(rows[0]);
};

export const deleteReptileHealthEvent = async (id: string): Promise<void> => {
  await executeVoid("DELETE FROM health_events WHERE id = ?;", [id]);
};
