import { execute, executeVoid } from "./db";

export type LocalReptile = {
  id: string;
  name: string;
  species: string;
  birth_date?: string | null;
  last_fed?: string | null;
  notes?: string | null;
  image_url?: string | null;
  sort_of_species?: string | null;
  diet?: string | null;
  humidity_level?: number | string | null;
  temperature_range?: string | null;
  danger_level?: string | null;
  acquired_date?: string | null;
  origin?: string | null;
  sex?: string | null;
  location?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Reptile = LocalReptile;

const mapReptile = (row: any): LocalReptile => ({
  ...row,
});

export const getReptiles = async (): Promise<LocalReptile[]> => {
  const rows = await execute("SELECT * FROM reptiles ORDER BY created_at DESC;");
  return rows.map(mapReptile);
};

export const getReptile = async (id: string): Promise<LocalReptile | null> => {
  const rows = await execute("SELECT * FROM reptiles WHERE id = ? LIMIT 1;", [
    id,
  ]);
  return rows[0] ? mapReptile(rows[0]) : null;
};

export type UpsertReptileInput = Partial<LocalReptile> & {
  name: string;
  species: string;
};

export const upsertReptile = async (
  input: UpsertReptileInput,
  id?: string,
): Promise<LocalReptile> => {
  const reptileId =
    id || input.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const existing = await getReptile(reptileId);
  if (existing) {
    await executeVoid(
      `UPDATE reptiles SET
        name=?,
        species=?,
        birth_date=?,
        last_fed=?,
        notes=?,
        image_url=?,
        sort_of_species=?,
        diet=?,
        humidity_level=?,
        temperature_range=?,
        danger_level=?,
        acquired_date=?,
        origin=?,
        sex=?,
        location=?,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=?;`,
      [
        input.name,
        input.species,
        input.birth_date ?? null,
        input.last_fed ?? null,
        input.notes ?? null,
        input.image_url ?? null,
        input.sort_of_species ?? null,
        input.diet ?? null,
        input.humidity_level ?? null,
        input.temperature_range ?? null,
        input.danger_level ?? null,
        input.acquired_date ?? null,
        input.origin ?? null,
        input.sex ?? null,
        input.location ?? null,
        reptileId,
      ],
    );
  } else {
    await executeVoid(
      `INSERT INTO reptiles(
        id,name,species,birth_date,last_fed,notes,image_url,sort_of_species,diet,humidity_level,temperature_range,danger_level,acquired_date,origin,sex,location
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
      [
        reptileId,
        input.name,
        input.species,
        input.birth_date ?? null,
        input.last_fed ?? null,
        input.notes ?? null,
        input.image_url ?? null,
        input.sort_of_species ?? null,
        input.diet ?? null,
        input.humidity_level ?? null,
        input.temperature_range ?? null,
        input.danger_level ?? null,
        input.acquired_date ?? null,
        input.origin ?? null,
        input.sex ?? null,
        input.location ?? null,
      ],
    );
  }
  const updated = await getReptile(reptileId);
  if (!updated) throw new Error("Failed to upsert reptile");
  return updated;
};

export const deleteReptile = async (id: string): Promise<void> => {
  await executeVoid("DELETE FROM reptiles WHERE id = ?;", [id]);
};

export const updateReptileFields = async (
  id: string,
  fields: Partial<LocalReptile>,
): Promise<LocalReptile | null> => {
  const existing = await getReptile(id);
  if (!existing) return null;
  const merged = { ...existing, ...fields };
  await upsertReptile(merged, id);
  return getReptile(id);
};
