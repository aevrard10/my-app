import {
  addReptileHealthEvent,
  getReptileHealthEvents,
  deleteReptileHealthEvent,
} from "../reptileHealthStore";

const mockStore = new Map<string, any>();

jest.mock("../db", () => ({
  execute: jest.fn(async (sql: string, params: any[] = []) => {
    if (sql.startsWith("SELECT * FROM health_events WHERE id")) {
      const id = params[0];
      const row = mockStore.get(id);
      return row ? [row] : [];
    }
    if (sql.includes("FROM health_events")) {
      const reptileId = params[0];
      const limit = params[1];
      const offset = params[2];
      const rows = Array.from(mockStore.values())
        .filter((row) => row.reptile_id === reptileId)
        .sort((a, b) => {
          if (a.event_date === b.event_date) {
            return (b.event_time || "").localeCompare(a.event_time || "");
          }
          return b.event_date.localeCompare(a.event_date);
        });
      return rows.slice(offset, offset + limit);
    }
    return [];
  }),
  executeVoid: jest.fn(async (sql: string, params: any[] = []) => {
    if (sql.startsWith("INSERT INTO health_events")) {
      const [id, reptile_id, event_type, event_date, event_time, notes] = params;
      mockStore.set(id, {
        id,
        reptile_id,
        event_type,
        event_date,
        event_time,
        notes,
        created_at: new Date().toISOString(),
      });
      return;
    }
    if (sql.startsWith("DELETE FROM health_events")) {
      const id = params[0];
      mockStore.delete(id);
      return;
    }
  }),
}));

describe("reptileHealthStore", () => {
  beforeEach(() => {
    mockStore.clear();
  });

  it("adds a health event", async () => {
    const event = await addReptileHealthEvent({
      reptile_id: "r1",
      event_type: "ACARIEN",
      event_date: "2026-02-06",
      event_time: "09:00",
      notes: "test",
    });
    expect(event.id).toBeTruthy();
    expect(event.event_type).toBe("ACARIEN");
  });

  it("adds a health event with optional fields missing", async () => {
    const event = await addReptileHealthEvent({
      reptile_id: "r1",
      event_type: "ACARIEN",
      event_date: "2026-02-06",
    });
    expect(event.event_time).toBeNull();
    expect(event.notes).toBeNull();
  });

  it("lists events ordered by date/time with pagination", async () => {
    await addReptileHealthEvent({
      reptile_id: "r1",
      event_type: "ACARIEN",
      event_date: "2026-02-06",
      event_time: "09:00",
      notes: null,
    });
    await addReptileHealthEvent({
      reptile_id: "r1",
      event_type: "INJURY",
      event_date: "2026-02-07",
      event_time: "10:00",
      notes: null,
    });
    const list = await getReptileHealthEvents("r1", { limit: 1, offset: 0 });
    expect(list[0].event_type).toBe("INJURY");
  });

  it("lists events with default options when options empty", async () => {
    await addReptileHealthEvent({
      reptile_id: "r1",
      event_type: "ACARIEN",
      event_date: "2026-02-06",
    });
    const list = await getReptileHealthEvents("r1", {});
    expect(list.length).toBe(1);
  });

  it("deletes a health event", async () => {
    const event = await addReptileHealthEvent({
      reptile_id: "r1",
      event_type: "ACARIEN",
      event_date: "2026-02-06",
      event_time: null,
      notes: null,
    });
    await deleteReptileHealthEvent(event.id);
    const list = await getReptileHealthEvents("r1");
    expect(list.length).toBe(0);
  });
});
