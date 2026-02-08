import {
  addReptileFeeding,
  getReptileFeedings,
  deleteReptileFeeding,
} from "../reptileFeedingsStore";

const mockStore = new Map<string, any>();

jest.mock("../db", () => ({
  execute: jest.fn(async (sql: string, params: any[] = []) => {
    if (sql.startsWith("SELECT * FROM feedings WHERE id")) {
      const id = params[0];
      const row = mockStore.get(id);
      return row ? [row] : [];
    }
    if (sql.startsWith("SELECT * FROM feedings WHERE reptile_id")) {
      const reptileId = params[0];
      const limit = params[1];
      const offset = params[2];
      const rows = Array.from(mockStore.values())
        .filter((row) => row.reptile_id === reptileId)
        .sort((a, b) => b.fed_at.localeCompare(a.fed_at));
      return rows.slice(offset, offset + limit);
    }
    return [];
  }),
  executeVoid: jest.fn(async (sql: string, params: any[] = []) => {
    if (sql.startsWith("INSERT INTO feedings")) {
      const [id, reptile_id, food_name, quantity, unit, fed_at, notes] = params;
      mockStore.set(id, {
        id,
        reptile_id,
        food_name,
        quantity,
        unit,
        fed_at,
        notes,
        created_at: new Date().toISOString(),
      });
      return;
    }
    if (sql.startsWith("DELETE FROM feedings")) {
      const id = params[0];
      mockStore.delete(id);
      return;
    }
  }),
}));

describe("reptileFeedingsStore", () => {
  beforeEach(() => {
    mockStore.clear();
  });

  it("adds and returns a feeding", async () => {
    const feeding = await addReptileFeeding({
      reptile_id: "stock",
      food_name: "mouse_adult",
      quantity: 5,
      unit: "pcs",
      fed_at: "2026-02-06",
      notes: "stock entry",
    });
    expect(feeding.id).toBeTruthy();
    expect(feeding.reptile_id).toBe("stock");
    expect(feeding.food_name).toBe("mouse_adult");
  });

  it("lists feedings ordered by fed_at desc with pagination", async () => {
    await addReptileFeeding({
      reptile_id: "stock",
      food_name: "mouse_adult",
      quantity: 5,
      unit: "pcs",
      fed_at: "2026-02-06",
      notes: null,
    });
    await addReptileFeeding({
      reptile_id: "stock",
      food_name: "rat_adult",
      quantity: 3,
      unit: "pcs",
      fed_at: "2026-02-07",
      notes: null,
    });
    const firstPage = await getReptileFeedings("stock", { limit: 1, offset: 0 });
    const secondPage = await getReptileFeedings("stock", { limit: 1, offset: 1 });
    expect(firstPage[0].food_name).toBe("rat_adult");
    expect(secondPage[0].food_name).toBe("mouse_adult");
  });

  it("deletes a feeding", async () => {
    const feeding = await addReptileFeeding({
      reptile_id: "stock",
      food_name: "mouse_adult",
      quantity: 2,
      unit: "pcs",
      fed_at: "2026-02-06",
      notes: null,
    });
    await deleteReptileFeeding(feeding.id);
    const list = await getReptileFeedings("stock");
    expect(list.length).toBe(0);
  });
});
