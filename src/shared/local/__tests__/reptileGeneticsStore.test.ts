import { execute, executeVoid } from "../db";
import {
  getReptileGenetics,
  upsertReptileGenetics,
} from "../reptileGeneticsStore";

jest.mock("../db", () => ({
  execute: jest.fn(),
  executeVoid: jest.fn(),
}));

describe("reptileGeneticsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getReptileGenetics returns null when no row", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([]);
    const res = await getReptileGenetics("r1");
    expect(res).toBeNull();
  });

  it("upsert inserts when missing", async () => {
    (execute as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { id: "g1", reptile_id: "r1", morph: "abc" },
      ]);

    const res = await upsertReptileGenetics({ reptile_id: "r1", morph: "abc" });
    expect(executeVoid).toHaveBeenCalled();
    expect(res?.reptile_id).toBe("r1");
  });

  it("upsert updates when existing", async () => {
    (execute as jest.Mock)
      .mockResolvedValueOnce([
        { id: "g1", reptile_id: "r1", morph: "old" },
      ])
      .mockResolvedValueOnce([
        { id: "g1", reptile_id: "r1", morph: "new" },
      ]);

    const res = await upsertReptileGenetics({ reptile_id: "r1", morph: "new" });
    expect(executeVoid).toHaveBeenCalled();
    expect(res?.morph).toBe("new");
  });

  it("upsert uses provided id", async () => {
    (execute as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { id: "custom", reptile_id: "r1", morph: "abc" },
      ]);

    const res = await upsertReptileGenetics({ id: "custom", reptile_id: "r1" });
    expect(res?.id).toBe("custom");
  });

  it("keeps existing values when input missing", async () => {
    (execute as jest.Mock)
      .mockResolvedValueOnce([
        { id: "g2", reptile_id: "r2", morph: "old" },
      ])
      .mockResolvedValueOnce([
        { id: "g2", reptile_id: "r2", morph: "old" },
      ]);

    const res = await upsertReptileGenetics({ reptile_id: "r2" });
    expect(res?.morph).toBe("old");
  });

  it("falls back to empty string when existing value missing", async () => {
    (execute as jest.Mock)
      .mockResolvedValueOnce([
        { id: "g3", reptile_id: "r3", morph: null },
      ])
      .mockResolvedValueOnce([
        { id: "g3", reptile_id: "r3", morph: "" },
      ]);

    const res = await upsertReptileGenetics({ reptile_id: "r3" });
    expect(res?.morph).toBe("");
  });

  it("throws if save fails", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    await expect(
      upsertReptileGenetics({ reptile_id: "r1" })
    ).rejects.toThrow("Failed to save genetics");
  });
});
