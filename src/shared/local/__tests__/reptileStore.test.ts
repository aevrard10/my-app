import {
  upsertReptile,
  getReptile,
  getReptiles,
  deleteReptile,
  updateReptileFields,
} from "../reptileStore";

const mockStore = new Map<string, any>();
let mockClock = 0;

jest.mock("../db", () => ({
  execute: jest.fn(async (sql: string, params: any[] = []) => {
    if (sql.startsWith("SELECT * FROM reptiles WHERE id")) {
      const id = params[0];
      const row = mockStore.get(id);
      return row ? [row] : [];
    }
    if (sql.startsWith("SELECT * FROM reptiles")) {
      return Array.from(mockStore.values()).sort((a, b) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime;
      });
    }
    return [];
  }),
  executeVoid: jest.fn(async (sql: string, params: any[] = []) => {
    if (sql.startsWith("INSERT INTO reptiles")) {
      const [
        id,
        name,
        species,
        birth_date,
        last_fed,
        notes,
        image_url,
        sort_of_species,
        diet,
        humidity_level,
        temperature_range,
        danger_level,
        acquired_date,
        origin,
        sex,
        location,
      ] = params;
      mockStore.set(id, {
        id,
        name,
        species,
        birth_date,
        last_fed,
        notes,
        image_url,
        sort_of_species,
        diet,
        humidity_level,
        temperature_range,
        danger_level,
        acquired_date,
        origin,
        sex,
        location,
        created_at: new Date(1700000000000 + mockClock++).toISOString(),
        updated_at: new Date(1700000000000 + mockClock++).toISOString(),
      });
      return;
    }
    if (sql.startsWith("UPDATE reptiles SET")) {
      const id = params[params.length - 1];
      const existing = mockStore.get(id) || { id };
      const fields = [
        "name",
        "species",
        "birth_date",
        "last_fed",
        "notes",
        "image_url",
        "sort_of_species",
        "diet",
        "humidity_level",
        "temperature_range",
        "danger_level",
        "acquired_date",
        "origin",
        "sex",
        "location",
      ];
      fields.forEach((field, idx) => {
        existing[field] = params[idx];
      });
      existing.updated_at = new Date().toISOString();
      mockStore.set(id, existing);
      return;
    }
    if (sql.startsWith("DELETE FROM reptiles")) {
      const id = params[0];
      mockStore.delete(id);
      return;
    }
  }),
}));

describe("reptileStore", () => {
  beforeEach(() => {
    mockStore.clear();
    mockClock = 0;
  });

  it("creates a reptile", async () => {
    const reptile = await upsertReptile({
      name: "Pogona",
      species: "Pogona vitticeps",
    });
    expect(reptile.id).toBeTruthy();
    expect(reptile.name).toBe("Pogona");
    expect(reptile.species).toBe("Pogona vitticeps");
  });

  it("updates an existing reptile", async () => {
    const reptile = await upsertReptile({
      name: "Pogona",
      species: "Pogona vitticeps",
    });
    const updated = await upsertReptile(
      {
        name: "Pogo",
        species: "Pogona vitticeps",
        origin: "Elevage",
      },
      reptile.id,
    );
    expect(updated.id).toBe(reptile.id);
    expect(updated.name).toBe("Pogo");
    expect(updated.origin).toBe("Elevage");
  });

  it("updates partial fields", async () => {
    const reptile = await upsertReptile({
      name: "Gecko",
      species: "Eublepharis macularius",
    });
    const updated = await updateReptileFields(reptile.id, {
      location: "Rack A",
    });
    expect(updated?.location).toBe("Rack A");
  });

  it("deletes a reptile", async () => {
    const reptile = await upsertReptile({
      name: "Test",
      species: "Test",
    });
    await deleteReptile(reptile.id);
    const fetched = await getReptile(reptile.id);
    expect(fetched).toBeNull();
  });

  it("returns reptiles ordered by created_at desc", async () => {
    const first = await upsertReptile({
      name: "First",
      species: "S1",
    });
    const second = await upsertReptile({
      name: "Second",
      species: "S2",
    });
    const all = await getReptiles();
    expect(all[0].id).toBe(second.id);
    expect(all[1].id).toBe(first.id);
  });
});
