describe("reptileEventsStore error", () => {
  it("throws when upsert fails to read back", async () => {
    jest.resetModules();
    jest.doMock("../db", () => ({
      execute: jest
        .fn()
        .mockResolvedValueOnce([]) // getReptileEvent before insert
        .mockResolvedValueOnce([]), // getReptileEvent after insert
      executeVoid: jest.fn(async () => {}),
    }));

    const { upsertReptileEvent } = require("../reptileEventsStore");
    await expect(
      upsertReptileEvent({ event_date: "2026-02-06" })
    ).rejects.toThrow("Failed to upsert event");
  });
});
