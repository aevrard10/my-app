import { execute, executeVoid } from "../db";
import { addMeasurement, getMeasurements } from "../measurementsStore";

jest.mock("../db", () => ({
  execute: jest.fn(),
  executeVoid: jest.fn(),
}));

describe("measurementsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getMeasurements returns mapped rows", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([{ id: "1", reptile_id: "r1" }]);

    const rows = await getMeasurements("r1", { limit: 10, offset: 0 });

    expect(execute).toHaveBeenCalled();
    expect(rows).toEqual([{ id: "1", reptile_id: "r1" }]);
  });

  it("getMeasurements uses default options", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([]);
    await getMeasurements("r1");
    expect(execute).toHaveBeenCalled();
  });

  it("getMeasurements uses fallback defaults when options empty", async () => {
    (execute as jest.Mock).mockResolvedValueOnce([]);
    await getMeasurements("r1", {});
    expect(execute).toHaveBeenCalled();
  });

  it("addMeasurement inserts and returns row", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "m1", reptile_id: "r1", date: "2024-01-01" },
    ]);

    const row = await addMeasurement({
      reptile_id: "r1",
      date: "2024-01-01",
      weight: 10,
      size: 20,
      size_mesure: "cm",
      weight_mesure: "g",
    });

    expect(executeVoid).toHaveBeenCalled();
    expect(execute).toHaveBeenCalled();
    expect(row.reptile_id).toBe("r1");
  });

  it("addMeasurement handles missing optional fields", async () => {
    (executeVoid as jest.Mock).mockResolvedValueOnce(undefined);
    (execute as jest.Mock).mockResolvedValueOnce([
      { id: "m2", reptile_id: "r1", date: "2024-01-02" },
    ]);

    const row = await addMeasurement({
      reptile_id: "r1",
      date: "2024-01-02",
    });

    expect(row.id).toBe("m2");
  });
});
