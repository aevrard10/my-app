import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { ListOptions } from "./storageAdapter";

const indexKey = `local_reptile_events:index`;
const bucketKey = (month: string) => `local_reptile_events:${month}`; // month = YYYY-MM

export type LocalReptileEvent = {
  id: string;
  event_name: string;
  event_date: string; // YYYY-MM-DD
  event_time?: string | null; // HH:mm
  notes?: string | null;
  recurrence_type?: string | null; // NONE/DAILY/WEEKLY/MONTHLY
  recurrence_interval?: number | null;
  recurrence_until?: string | null; // YYYY-MM-DD
  reptile_id?: string | null;
  reptile_name?: string | null;
  reptile_image_url?: string | null;
};

const monthFromDate = (date: string) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "unknown";
  return `${d.getFullYear().toString().padStart(4, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
};

const readIndex = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(indexKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeIndex = async (months: string[]) => {
  const unique = Array.from(new Set(months));
  unique.sort().reverse();
  await AsyncStorage.setItem(indexKey, JSON.stringify(unique));
};

const readBucket = async (month: string): Promise<LocalReptileEvent[]> => {
  const raw = await AsyncStorage.getItem(bucketKey(month));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeBucket = async (month: string, items: LocalReptileEvent[]) => {
  await AsyncStorage.setItem(bucketKey(month), JSON.stringify(items));
};

export const getReptileEvents = async (
  options: ListOptions = { limit: 200, offset: 0 },
): Promise<LocalReptileEvent[]> => {
  const { limit = 200, offset = 0 } = options;
  const months = await readIndex();
  const results: LocalReptileEvent[] = [];
  for (const month of months) {
    if (results.length >= limit + offset) break;
    const bucket = await readBucket(month);
    bucket
      .sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
      )
      .forEach((e) => {
        if (results.length < limit + offset) results.push(e);
      });
  }
  return results.slice(offset, offset + limit);
};

export const upsertReptileEvent = async (
  input: Partial<LocalReptileEvent>,
): Promise<LocalReptileEvent> => {
  const month = monthFromDate(
    input.event_date || dayjs().format("YYYY-MM-DD"),
  );
  const bucket = await readBucket(month);
  const id = input.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const next: LocalReptileEvent = {
    id,
    event_name: input.event_name || "Événement",
    event_date: input.event_date || dayjs().format("YYYY-MM-DD"),
    event_time: input.event_time ?? "",
    notes: input.notes ?? "",
    recurrence_type: input.recurrence_type ?? "NONE",
    recurrence_interval: input.recurrence_interval ?? 1,
    recurrence_until: input.recurrence_until ?? "",
    reptile_id: input.reptile_id ?? null,
    reptile_name: input.reptile_name ?? null,
    reptile_image_url: input.reptile_image_url ?? null,
  };
  const idx = bucket.findIndex((e) => e.id === id);
  if (idx >= 0) {
    bucket[idx] = { ...bucket[idx], ...next };
  } else {
    bucket.push(next);
  }
  await writeBucket(month, bucket);
  const months = await readIndex();
  if (!months.includes(month)) {
    months.push(month);
    await writeIndex(months);
  }
  return next;
};

export const deleteReptileEvent = async (id: string, event_date?: string) => {
  const months = await readIndex();
  const targets = event_date ? [monthFromDate(event_date)] : months;
  for (const month of targets) {
    const bucket = await readBucket(month);
    const filtered = bucket.filter((e) => e.id !== id);
    if (filtered.length !== bucket.length) {
      await writeBucket(month, filtered);
      if (filtered.length === 0) {
        const nextIdx = (await readIndex()).filter((m) => m !== month);
        await writeIndex(nextIdx);
      }
    }
  }
};

export const excludeReptileEventOccurrence = async (
  id: string,
  date?: string,
): Promise<void> => deleteReptileEvent(id, date);
