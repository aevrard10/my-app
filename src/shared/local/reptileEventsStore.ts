import dayjs from "dayjs";
import { execute, executeVoid } from "./db";
import { ListOptions } from "./storageAdapter";

export type LocalReptileEvent = {
  id: string;
  event_name: string;
  event_type?: string | null;
  event_date: string; // YYYY-MM-DD
  event_time?: string | null; // HH:mm
  notes?: string | null;
  recurrence_type?: string | null; // NONE/DAILY/WEEKLY/MONTHLY
  recurrence_interval?: number | null;
  recurrence_until?: string | null; // YYYY-MM-DD
  excluded_dates?: string | null; // JSON array of YYYY-MM-DD
  reptile_id?: string | null;
  reptile_name?: string | null;
  reptile_image_url?: string | null;
  reminder_minutes?: number | null;
  priority?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const mapRow = (row: any): LocalReptileEvent => ({ ...row });

const normalizeNumber = (value: any, fallback: number) => {
  if (value === null || value === undefined || value === "") return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeText = (value?: string | null) => {
  const trimmed = (value ?? "").toString().trim();
  return trimmed.length ? trimmed : null;
};

export const getReptileEvents = async (
  options: ListOptions = { limit: 5000, offset: 0 },
): Promise<LocalReptileEvent[]> => {
  const { limit = 5000, offset = 0 } = options;
  const rows = await execute(
    `SELECT * FROM events ORDER BY event_date ASC, event_time ASC LIMIT ? OFFSET ?;`,
    [limit, offset],
  );
  return rows.map(mapRow);
};

export const getReptileEvent = async (
  id: string,
): Promise<LocalReptileEvent | null> => {
  const rows = await execute("SELECT * FROM events WHERE id = ? LIMIT 1;", [
    id,
  ]);
  return rows[0] ? mapRow(rows[0]) : null;
};

export const upsertReptileEvent = async (
  input: Partial<LocalReptileEvent>,
): Promise<LocalReptileEvent> => {
  const eventId =
    input.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const existing = await getReptileEvent(eventId);

  const merged = { ...(existing ?? {}), ...input };
  const event_name =
    normalizeText(merged.event_name) || "Événement";
  const event_date =
    normalizeText(merged.event_date) || dayjs().format("YYYY-MM-DD");
  const event_time = normalizeText(merged.event_time) || "";
  const event_type = normalizeText(merged.event_type) || "OTHER";
  const notes = normalizeText(merged.notes) || "";
  const recurrence_type =
    normalizeText(merged.recurrence_type) || "NONE";
  const recurrence_interval = normalizeNumber(merged.recurrence_interval, 1);
  const recurrence_until = normalizeText(merged.recurrence_until) || "";
  const reptile_id = normalizeText(merged.reptile_id);
  const reptile_name = normalizeText(merged.reptile_name);
  const reptile_image_url = normalizeText(merged.reptile_image_url);
  const reminder_minutes = normalizeNumber(merged.reminder_minutes, 0);
  const priority = normalizeText(merged.priority) || "NORMAL";
  const excluded_dates = normalizeText(merged.excluded_dates) || "";

  if (existing) {
    await executeVoid(
      `UPDATE events SET
        reptile_id=?,
        reptile_name=?,
        reptile_image_url=?,
        event_name=?,
        event_type=?,
        event_date=?,
        event_time=?,
        notes=?,
        recurrence_type=?,
        recurrence_interval=?,
        recurrence_until=?,
        reminder_minutes=?,
        priority=?,
        excluded_dates=?,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=?;`,
      [
        reptile_id,
        reptile_name,
        reptile_image_url,
        event_name,
        event_type,
        event_date,
        event_time,
        notes,
        recurrence_type,
        recurrence_interval,
        recurrence_until,
        reminder_minutes,
        priority,
        excluded_dates,
        eventId,
      ],
    );
  } else {
    await executeVoid(
      `INSERT INTO events(
        id,
        reptile_id,
        reptile_name,
        reptile_image_url,
        event_name,
        event_type,
        event_date,
        event_time,
        notes,
        recurrence_type,
        recurrence_interval,
        recurrence_until,
        reminder_minutes,
        priority,
        excluded_dates
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
      [
        eventId,
        reptile_id,
        reptile_name,
        reptile_image_url,
        event_name,
        event_type,
        event_date,
        event_time,
        notes,
        recurrence_type,
        recurrence_interval,
        recurrence_until,
        reminder_minutes,
        priority,
        excluded_dates,
      ],
    );
  }

  const updated = await getReptileEvent(eventId);
  if (!updated) throw new Error("Failed to upsert event");
  return updated;
};

export const deleteReptileEvent = async (id: string): Promise<void> => {
  await executeVoid("DELETE FROM events WHERE id = ?;", [id]);
};

export const excludeReptileEventOccurrence = async (
  id: string,
  date?: string,
): Promise<void> => {
  if (!date) return;
  const existing = await getReptileEvent(id);
  if (!existing) return;
  const parsed: string[] = (() => {
    if (!existing.excluded_dates) return [];
    try {
      const arr = JSON.parse(existing.excluded_dates);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  })();
  if (!parsed.includes(date)) parsed.push(date);
  await executeVoid(
    `UPDATE events SET excluded_dates=?, updated_at=CURRENT_TIMESTAMP WHERE id=?;`,
    [JSON.stringify(parsed), id],
  );
};
