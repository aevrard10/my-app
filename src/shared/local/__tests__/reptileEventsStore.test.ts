import {
  upsertReptileEvent,
  getReptileEvent,
  getReptileEvents,
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

  it("handles invalid numeric values", async () => {
    const created = await upsertReptileEvent({
      event_date: "2026-02-06",
      recurrence_interval: "bad" as any,
      reminder_minutes: "bad" as any,
    });
    expect(created.recurrence_interval).toBe(1);
    expect(created.reminder_minutes).toBe(0);
  });

  it("uses default event_date when missing", async () => {
    const created = await upsertReptileEvent({});
    expect(created.event_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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

  it("lists events", async () => {
    await upsertReptileEvent({ event_date: "2026-02-06" });
    const list = await getReptileEvents({ limit: 10, offset: 0 });
    expect(list.length).toBe(1);
  });

  it("lists events with default options", async () => {
    await upsertReptileEvent({ event_date: "2026-02-06" });
    const list = await getReptileEvents();
    expect(list.length).toBe(1);
  });

  it("lists events with partial options", async () => {
    await upsertReptileEvent({ event_date: "2026-02-06" });
    const list = await getReptileEvents({ limit: 5 });
    expect(list.length).toBe(1);
  });

  it("lists events with offset-only options", async () => {
    await upsertReptileEvent({ event_date: "2026-02-06" });
    const list = await getReptileEvents({ offset: 0 });
    expect(list.length).toBe(1);
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

  it("ignores exclude when date or event missing", async () => {
    await excludeReptileEventOccurrence("missing", undefined);
    await excludeReptileEventOccurrence("missing", "2026-02-07");
    expect(mockStore.size).toBe(0);
  });

  it("handles invalid excluded_dates JSON", async () => {
    const created = await upsertReptileEvent({
      event_date: "2026-02-06",
      event_name: "Test",
    });
    mockStore.set(created.id, { ...created, excluded_dates: "not-json" });
    await excludeReptileEventOccurrence(created.id, "2026-02-08");
    const fetched = await getReptileEvent(created.id);
    expect(fetched?.excluded_dates).toContain("2026-02-08");
  });

  it("handles non-array excluded_dates JSON", async () => {
    const created = await upsertReptileEvent({
      event_date: "2026-02-06",
      event_name: "Test",
    });
    mockStore.set(created.id, {
      ...created,
      excluded_dates: JSON.stringify({ bad: true }),
    });
    await excludeReptileEventOccurrence(created.id, "2026-02-09");
    const fetched = await getReptileEvent(created.id);
    expect(fetched?.excluded_dates).toContain("2026-02-09");
  });

  it("does not duplicate excluded dates", async () => {
    const created = await upsertReptileEvent({
      event_date: "2026-02-06",
      event_name: "Test",
    });
    mockStore.set(created.id, {
      ...created,
      excluded_dates: JSON.stringify(["2026-02-10"]),
    });
    await excludeReptileEventOccurrence(created.id, "2026-02-10");
    const fetched = await getReptileEvent(created.id);
    const parsed = JSON.parse(fetched?.excluded_dates || "[]");
    expect(parsed).toEqual(["2026-02-10"]);
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
