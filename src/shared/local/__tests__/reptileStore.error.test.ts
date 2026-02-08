describe("reptileStore error", () => {
  it("throws when upsert fails to read back", async () => {
    jest.resetModules();
    jest.doMock("../db", () => ({
      execute: jest
        .fn()
        .mockResolvedValueOnce([]) // getReptile before insert
        .mockResolvedValueOnce([]), // getReptile after insert
      executeVoid: jest.fn(async () => {}),
    }));

    const { upsertReptile } = require("../reptileStore");
    await expect(
      upsertReptile({ name: "A", species: "B" })
    ).rejects.toThrow("Failed to upsert reptile");
  });
});
