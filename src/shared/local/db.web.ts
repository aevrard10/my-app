import * as SQLite from "expo-sqlite/next";

type Row = Record<string, any>;

const dbPromise = SQLite.openDatabaseAsync("reptitrack.db");

export const execute = async <T = Row>(
  sql: string,
  params: any[] = [],
): Promise<T[]> => {
  const db = await dbPromise;
  const rows = await db.getAllAsync(sql, params);
  return rows as T[];
};

export const executeVoid = async (
  sql: string,
  params: any[] = [],
): Promise<void> => {
  const db = await dbPromise;
  await db.runAsync(sql, params);
};

export const runMigrations = async () => {
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS reptiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      age REAL,
      last_fed TEXT,
      notes TEXT,
      image_url TEXT,
      sort_of_species TEXT,
      feeding_schedule TEXT,
      diet TEXT,
      humidity_level REAL,
      temperature_range TEXT,
      health_status TEXT,
      acquired_date TEXT,
      origin TEXT,
      sex TEXT,
      location TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_reptiles_last_fed ON reptiles(last_fed);

    CREATE TABLE IF NOT EXISTS genetics (
      id TEXT PRIMARY KEY,
      reptile_id TEXT NOT NULL,
      morph TEXT,
      mutations TEXT,
      hets TEXT,
      traits TEXT,
      lineage TEXT,
      breeder TEXT,
      hatch_date TEXT,
      sire_name TEXT,
      dam_name TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_genetics_reptile ON genetics(reptile_id);

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      reptile_id TEXT NOT NULL,
      uri TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_photos_reptile_created ON photos(reptile_id, created_at DESC);

    CREATE TABLE IF NOT EXISTS feedings (
      id TEXT PRIMARY KEY,
      reptile_id TEXT NOT NULL,
      food_name TEXT,
      quantity REAL,
      unit TEXT,
      fed_at TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_feedings_reptile_date ON feedings(reptile_id, fed_at DESC);

    CREATE TABLE IF NOT EXISTS sheds (
      id TEXT PRIMARY KEY,
      reptile_id TEXT NOT NULL,
      shed_date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_sheds_reptile_date ON sheds(reptile_id, shed_date DESC);

    CREATE TABLE IF NOT EXISTS measurements (
      id TEXT PRIMARY KEY,
      reptile_id TEXT NOT NULL,
      date TEXT NOT NULL,
      weight REAL,
      size REAL,
      size_mesure TEXT,
      weight_mesure TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_measurements_reptile_date ON measurements(reptile_id, date DESC);

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      reptile_id TEXT,
      event_name TEXT NOT NULL,
      event_date TEXT NOT NULL,
      event_time TEXT,
      notes TEXT,
      recurrence_type TEXT,
      recurrence_interval INTEGER,
      recurrence_until TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_events_reptile_date ON events(reptile_id, event_date);
    CREATE INDEX IF NOT EXISTS idx_events_type_date ON events(event_name, event_date);
  `);
};

