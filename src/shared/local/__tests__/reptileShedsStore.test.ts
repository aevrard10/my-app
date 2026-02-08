import { execute, executeVoid } from "../db";
import {
  addReptileShed,
  deleteReptileShed,
  getReptileSheds,
} from "../reptileShedsStore";

jest.mock("../db", () => ({
  execute: jest.fn(),
  executeVoid: jest.fn(),
}));

describe("reptileShedsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getReptileSheds returns rows", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "s1", reptile_id: "r1" },
    ]);
    const rows = await getReptileSheds("r1", { limit: 10, offset: 0 });
    expect(rows[0].id).toBe("s1");
  });

  it("getReptileSheds uses default options", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([]);
    await getReptileSheds("r1");
    expect(execute).toHaveBeenCalled();
  });

  it("getReptileSheds uses partial options", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([]);
    await getReptileSheds("r1", { limit: 5 });
    expect(execute).toHaveBeenCalled();
  });

  it("getReptileSheds uses empty options", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([]);
    await getReptileSheds("r1", {});
    expect(execute).toHaveBeenCalled();
  });

  it("addReptileShed inserts and returns row", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "s2", reptile_id: "r1" },
    ]);
    const res = await addReptileShed({
      reptile_id: "r1",
      shed_date: "2024-01-01",
      notes: "ok",
    });
    expect(executeVoid).toHaveBeenCalled();
    expect(res.id).toBe("s2");
  });

  it("addReptileShed handles missing notes", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "s3", reptile_id: "r1" },
    ]);
    const res = await addReptileShed({
      reptile_id: "r1",
      shed_date: "2024-01-02",
    });
    expect(res.id).toBe("s3");
  });

  it("deleteReptileShed removes row", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    await deleteReptileShed("s4");
    expect(executeVoid).toHaveBeenCalled();
  });
});
