import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  upsertReptile,
  LocalReptile,
} from "../reptileStore";
import { upsertReptileGenetics } from "../reptileGeneticsStore";
import {
  addReptilePhotoFromBase64,
  addReptilePhotoFromUri,
} from "../reptilePhotosStore";
import { addReptileFeeding } from "../reptileFeedingsStore";
import { addReptileShed } from "../reptileShedsStore";
import { addMeasurement } from "../measurementsStore";
import { upsertReptileEvent } from "../reptileEventsStore";

const FLAG_KEY = "local_migration_v1_done";

const safeParse = (raw: string | null) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const runAsyncStorageMigration = async () => {
  const flag = await AsyncStorage.getItem(FLAG_KEY);
  if (flag === "1") return;

  const keys = await AsyncStorage.getAllKeys();

  // Reptiles
  if (keys.includes("local_reptiles")) {
    const reptilesRaw = await AsyncStorage.getItem("local_reptiles");
    const reptiles: LocalReptile[] = safeParse(reptilesRaw) || [];
    for (const r of reptiles) {
      await upsertReptile(r, r.id);
    }
  }

  // Genetics
  if (keys.includes("local_reptile_genetics")) {
    const geneticsRaw = await AsyncStorage.getItem("local_reptile_genetics");
    const genetics = safeParse(geneticsRaw) || [];
    for (const g of genetics) {
      await upsertReptileGenetics(g);
    }
  }

  // Photos (single bucket case)
  if (keys.includes("local_reptile_photos")) {
    const photosRaw = await AsyncStorage.getItem("local_reptile_photos");
    const photos = safeParse(photosRaw) || [];
    for (const p of photos) {
      if (p.url?.startsWith("data:")) {
        const base64 = p.url.split(",")[1] || "";
        await addReptilePhotoFromBase64(p.reptile_id, base64);
      } else if (p.url) {
        await addReptilePhotoFromUri(p.reptile_id, p.url);
      }
    }
  }

  // Feedings buckets
  const feedingBuckets = keys.filter((k) =>
    k.startsWith("local_reptile_feedings"),
  );
  for (const k of feedingBuckets) {
    const raw = await AsyncStorage.getItem(k);
    const arr = safeParse(raw) || [];
    for (const f of arr) {
      await addReptileFeeding({
        reptile_id: f.reptile_id,
        food_name: f.food_name,
        quantity: f.quantity,
        unit: f.unit,
        fed_at: f.fed_at,
        notes: f.notes,
      });
    }
  }

  // Sheds buckets
  const shedBuckets = keys.filter((k) =>
    k.startsWith("local_reptile_sheds"),
  );
  for (const k of shedBuckets) {
    const raw = await AsyncStorage.getItem(k);
    const arr = safeParse(raw) || [];
    for (const s of arr) {
      await addReptileShed({
        reptile_id: s.reptile_id,
        shed_date: s.shed_date,
        notes: s.notes,
      });
    }
  }

  // Measurements buckets
  const measBuckets = keys.filter((k) =>
    k.startsWith("local_reptile_measurements"),
  );
  for (const k of measBuckets) {
    const raw = await AsyncStorage.getItem(k);
    const arr = safeParse(raw) || [];
    for (const m of arr) {
      await addMeasurement({
        reptile_id: m.reptile_id,
        date: m.date,
        weight: m.weight,
        size: m.size,
        size_mesure: m.size_mesure,
        weight_mesure: m.weight_mesure,
      });
    }
  }

  // Events buckets
  const eventBuckets = keys.filter((k) =>
    k.startsWith("local_reptile_events"),
  );
  for (const k of eventBuckets) {
    const raw = await AsyncStorage.getItem(k);
    const arr = safeParse(raw) || [];
    for (const e of arr) {
      await upsertReptileEvent({
        id: e.id,
        event_name: e.event_name,
        event_type: e.event_type,
        event_date: e.event_date,
        event_time: e.event_time,
        notes: e.notes,
        recurrence_type: e.recurrence_type,
        recurrence_interval: e.recurrence_interval,
        recurrence_until: e.recurrence_until,
        reptile_id: e.reptile_id,
        reptile_name: e.reptile_name,
        reptile_image_url: e.reptile_image_url,
        reminder_minutes: e.reminder_minutes,
        priority: e.priority,
      });
    }
  }

  await AsyncStorage.setItem(FLAG_KEY, "1");
};
