import * as FileSystem from "expo-file-system/legacy";
import { execute, executeVoid } from "../db";
import {
  addReptilePhotoFromBase64,
  addReptilePhotoFromUri,
  deleteReptilePhoto,
  getReptilePhotos,
} from "../reptilePhotosStore";

jest.mock("../db", () => ({
  execute: jest.fn(),
  executeVoid: jest.fn(),
}));

describe("reptilePhotosStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getReptilePhotos maps rows", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p1", reptile_id: "r1", uri: "file://a", created_at: "now" },
    ]);
    const rows = await getReptilePhotos("r1");
    expect(rows[0].url).toBe("file://a");
  });

  it("addReptilePhotoFromUri copies file", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p1", reptile_id: "r1", uri: "file://stored", created_at: "now" },
    ]);

    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValueOnce({ exists: false });
    const res = await addReptilePhotoFromUri("r1", "file://src.jpg");
    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalled();
    expect(FileSystem.copyAsync).toHaveBeenCalled();
    expect(res.reptile_id).toBe("r1");
  });

  it("addReptilePhotoFromUri skips mkdir when dir exists", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p2", reptile_id: "r2", uri: "file://stored", created_at: "now" },
    ]);

    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValueOnce({ exists: true });
    await addReptilePhotoFromUri("r2", "file://src.jpg");
    expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
  });

  it("addReptilePhotoFromUri falls back on error", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p3", reptile_id: "r3", uri: "file://src.jpg", created_at: "now" },
    ]);

    (FileSystem.copyAsync as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    const res = await addReptilePhotoFromUri("r3", "file://src.jpg");
    expect(res.url).toBe("file://src.jpg");
  });

  it("addReptilePhotoFromBase64 writes file", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p4", reptile_id: "r4", uri: "file://stored", created_at: "now" },
    ]);

    const res = await addReptilePhotoFromBase64("r4", "base64data", "image/png");
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    expect(res.reptile_id).toBe("r4");
  });

  it("addReptilePhotoFromBase64 falls back to jpg when mime invalid", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p5", reptile_id: "r5", uri: "file://stored", created_at: "now" },
    ]);

    await addReptilePhotoFromBase64("r5", "base64data", "image");
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
  });

  it("addReptilePhotoFromBase64 uses default mime when omitted", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p7", reptile_id: "r7", uri: "file://stored", created_at: "now" },
    ]);

    await addReptilePhotoFromBase64("r7", "base64data");
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
  });

  it("addReptilePhotoFromUri uses jpg fallback when ext missing", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p6", reptile_id: "r6", uri: "file://stored", created_at: "now" },
    ]);
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValueOnce({ exists: true });
    await addReptilePhotoFromUri("r6", "file://src.");
    expect(FileSystem.copyAsync).toHaveBeenCalled();
  });

  it("deleteReptilePhoto removes file and row", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p1", reptile_id: "r1", uri: "file://stored" },
    ]);
    await deleteReptilePhoto("p1");
    expect(FileSystem.deleteAsync).toHaveBeenCalled();
    expect(executeVoid).toHaveBeenCalled();
  });

  it("deleteReptilePhoto ignores delete errors", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "p2", reptile_id: "r1", uri: "file://stored" },
    ]);
    (FileSystem.deleteAsync as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    await deleteReptilePhoto("p2");
    expect(executeVoid).toHaveBeenCalled();
  });

  it("deleteReptilePhoto ignores missing uri", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([]);
    await deleteReptilePhoto("p3");
    expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
  });
});
