import {
  upsertReptileEvent,
  getReptileEvent,
  deleteReptileEvent,
  excludeReptileEventOccurrence,
} from "../reptileEventsStore";

const mockStore = new Map<string, any>();

jest.mock("../db", () => ({
  execute: jest.fn(async (sql: string, params: any[]) => {
    if (sql.startsWith("SELECT * FROM events WHERE id")) {
      const id = params[0];
      const row = mockStore.get(id);
      return row ? [row] : [];
    }
    if (sql.startsWith("SELECT * FROM events")) {
      return Array.from(mockStore.values());
    }
    return [];
  }),
  executeVoid: jest.fn(async (sql: string, params: any[]) => {
    if (sql.startsWith("INSERT INTO events")) {
      const [
        id,
        reptile_id,
        reptile_name,
        reptile_image_url,
        event_name,
        event_type,
        event_date,
        event_time,
        notes,
        recurrence_type,
        recurrence_interval,
        recurrence_until,
        reminder_minutes,
        priority,
        excluded_dates,
      ] = params;
      mockStore.set(id, {
        id,
        reptile_id,
        reptile_name,
        reptile_image_url,
        event_name,
        event_type,
        event_date,
        event_time,
        notes,
        recurrence_type,
        recurrence_interval,
        recurrence_until,
        reminder_minutes,
        priority,
        excluded_dates,
      });
      return;
    }
    if (sql.startsWith("UPDATE events SET excluded_dates")) {
      const excluded = params[0];
      const id = params[1];
      const existing = mockStore.get(id) || { id };
      existing.excluded_dates = excluded;
      mockStore.set(id, existing);
      return;
    }
    if (sql.startsWith("UPDATE events SET")) {
      const id = params[params.length - 1];
      const existing = mockStore.get(id) || { id };
      const fields = [
        "reptile_id",
        "reptile_name",
        "reptile_image_url",
        "event_name",
        "event_type",
        "event_date",
        "event_time",
        "notes",
        "recurrence_type",
        "recurrence_interval",
        "recurrence_until",
        "reminder_minutes",
        "priority",
        "excluded_dates",
      ];
      fields.forEach((field, idx) => {
        existing[field] = params[idx];
      });
      mockStore.set(id, existing);
      return;
    }
    if (sql.startsWith("DELETE FROM events")) {
      const id = params[0];
      mockStore.delete(id);
      return;
    }
  }),
}));

describe("reptileEventsStore", () => {
  beforeEach(() => {
    mockStore.clear();
  });

  it("upserts a new event with defaults", async () => {
    const created = await upsertReptileEvent({
      event_date: "2026-02-06",
    });
    expect(created.id).toBeTruthy();
    expect(created.event_name).toBe("Événement");
    expect(created.event_type).toBe("OTHER");
    expect(created.recurrence_type).toBe("NONE");
    expect(created.recurrence_interval).toBe(1);
    expect(created.event_time).toBe("");
    expect(created.notes).toBe("");
    expect(created.priority).toBe("NORMAL");
  });

  it("updates an existing event", async () => {
    const created = await upsertReptileEvent({
      event_date: "2026-02-06",
      event_name: "Test",
    });
    const updated = await upsertReptileEvent({
      id: created.id,
      notes: "Updated",
    });
    expect(updated.id).toBe(created.id);
    expect(updated.notes).toBe("Updated");
  });

  it("excludes an occurrence date", async () => {
    const created = await upsertReptileEvent({
      event_date: "2026-02-06",
      event_name: "Test",
    });
    await excludeReptileEventOccurrence(created.id, "2026-02-07");
    const fetched = await getReptileEvent(created.id);
    expect(fetched?.excluded_dates).toContain("2026-02-07");
  });

  it("deletes an event", async () => {
    const created = await upsertReptileEvent({
      event_date: "2026-02-06",
    });
    await deleteReptileEvent(created.id);
    const fetched = await getReptileEvent(created.id);
    expect(fetched).toBeNull();
  });
});
