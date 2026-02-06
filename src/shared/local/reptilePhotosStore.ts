import * as FileSystem from "expo-file-system/legacy";
import { execute, executeVoid } from "./db";

export type LocalReptilePhoto = {
  id: string;
  reptile_id: string;
  url: string;
  created_at: string;
};

const mapRow = (row: any): LocalReptilePhoto => ({
  id: row.id,
  reptile_id: row.reptile_id,
  url: row.uri,
  created_at: row.created_at,
});

const ensureDir = async () => {
  const dir = `${FileSystem.documentDirectory}reptitrack/photos/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
};

export const getReptilePhotos = async (
  reptileId: string,
): Promise<LocalReptilePhoto[]> => {
  const rows = await execute(
    "SELECT * FROM photos WHERE reptile_id = ? ORDER BY created_at DESC;",
    [reptileId],
  );
  return rows.map(mapRow);
};

export const addReptilePhotoFromUri = async (
  reptileId: string,
  sourceUri: string,
): Promise<LocalReptilePhoto> => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let storedUri = sourceUri;
  try {
    const dir = await ensureDir();
    const ext = sourceUri.split(".").pop() || "jpg";
    const dest = `${dir}${id}.${ext}`;
    await FileSystem.copyAsync({ from: sourceUri, to: dest });
    storedUri = dest;
  } catch {
    // fallback keep original uri
  }
  await executeVoid(
    "INSERT INTO photos (id, reptile_id, uri) VALUES (?,?,?);",
    [id, reptileId, storedUri],
  );
  const rows = await execute("SELECT * FROM photos WHERE id = ?;", [id]);
  return mapRow(rows[0]);
};

export const addReptilePhotoFromBase64 = async (
  reptileId: string,
  base64: string,
  mime = "image/jpeg",
): Promise<LocalReptilePhoto> => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const dir = await ensureDir();
  const ext = mime.split("/")[1] || "jpg";
  const dest = `${dir}${id}.${ext}`;
  await FileSystem.writeAsStringAsync(dest, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  await executeVoid(
    "INSERT INTO photos (id, reptile_id, uri) VALUES (?,?,?);",
    [id, reptileId, dest],
  );
  const rows = await execute("SELECT * FROM photos WHERE id = ?;", [id]);
  return mapRow(rows[0]);
};

export const deleteReptilePhoto = async (id: string): Promise<void> => {
  const rows = await execute("SELECT * FROM photos WHERE id = ?;", [id]);
  if (rows[0]?.uri) {
    const uri = rows[0].uri;
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch {
      // ignore
    }
  }
  await executeVoid("DELETE FROM photos WHERE id = ?;", [id]);
};

