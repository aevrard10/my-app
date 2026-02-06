import { execute, executeVoid } from "./db";

export type LocalReptileGenetics = {
  id: string;
  reptile_id: string;
  morph?: string | null;
  mutations?: string | null;
  hets?: string | null;
  traits?: string | null;
  lineage?: string | null;
  breeder?: string | null;
  hatch_date?: string | null;
  sire_name?: string | null;
  dam_name?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

const mapRow = (row: any): LocalReptileGenetics => ({ ...row });

export const getReptileGenetics = async (
  reptileId: string,
): Promise<LocalReptileGenetics | null> => {
  const rows = await execute(
    "SELECT * FROM genetics WHERE reptile_id = ? LIMIT 1;",
    [reptileId],
  );
  return rows[0] ? mapRow(rows[0]) : null;
};

export const upsertReptileGenetics = async (
  input: Partial<LocalReptileGenetics> & { reptile_id: string },
): Promise<LocalReptileGenetics> => {
  const existing = await getReptileGenetics(input.reptile_id);
  const id =
    input.id || existing?.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  if (existing) {
    await executeVoid(
      `UPDATE genetics SET
        morph=?,
        mutations=?,
        hets=?,
        traits=?,
        lineage=?,
        breeder=?,
        hatch_date=?,
        sire_name=?,
        dam_name=?,
        notes=?,
        updated_at=CURRENT_TIMESTAMP
      WHERE reptile_id=?;`,
      [
        input.morph ?? existing.morph ?? "",
        input.mutations ?? existing.mutations ?? "",
        input.hets ?? existing.hets ?? "",
        input.traits ?? existing.traits ?? "",
        input.lineage ?? existing.lineage ?? "",
        input.breeder ?? existing.breeder ?? "",
        input.hatch_date ?? existing.hatch_date ?? "",
        input.sire_name ?? existing.sire_name ?? "",
        input.dam_name ?? existing.dam_name ?? "",
        input.notes ?? existing.notes ?? "",
        input.reptile_id,
      ],
    );
  } else {
    await executeVoid(
      `INSERT INTO genetics(
        id,reptile_id,morph,mutations,hets,traits,lineage,breeder,hatch_date,sire_name,dam_name,notes
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`,
      [
        id,
        input.reptile_id,
        input.morph ?? "",
        input.mutations ?? "",
        input.hets ?? "",
        input.traits ?? "",
        input.lineage ?? "",
        input.breeder ?? "",
        input.hatch_date ?? "",
        input.sire_name ?? "",
        input.dam_name ?? "",
        input.notes ?? "",
      ],
    );
  }
  const res = await getReptileGenetics(input.reptile_id);
  if (!res) throw new Error("Failed to save genetics");
  return res;
};
