import AsyncStorage from "@react-native-async-storage/async-storage";
import { runAsyncStorageMigration } from "../migrations/asyncStorageMigration";

const mockUpsertReptile = jest.fn(async () => {});
const mockUpsertReptileGenetics = jest.fn(async () => {});
const mockAddReptilePhotoFromBase64 = jest.fn(async () => {});
const mockAddReptilePhotoFromUri = jest.fn(async () => {});
const mockAddReptileFeeding = jest.fn(async () => {});
const mockAddReptileShed = jest.fn(async () => {});
const mockAddMeasurement = jest.fn(async () => {});
const mockUpsertReptileEvent = jest.fn(async () => {});

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  getAllKeys: jest.fn(),
}));

jest.mock("../reptileStore", () => ({
  upsertReptile: (...args: any[]) => mockUpsertReptile(...args),
}));

jest.mock("../reptileGeneticsStore", () => ({
  upsertReptileGenetics: (...args: any[]) =>
    mockUpsertReptileGenetics(...args),
}));

jest.mock("../reptilePhotosStore", () => ({
  addReptilePhotoFromBase64: (...args: any[]) =>
    mockAddReptilePhotoFromBase64(...args),
  addReptilePhotoFromUri: (...args: any[]) =>
    mockAddReptilePhotoFromUri(...args),
}));

jest.mock("../reptileFeedingsStore", () => ({
  addReptileFeeding: (...args: any[]) => mockAddReptileFeeding(...args),
}));

jest.mock("../reptileShedsStore", () => ({
  addReptileShed: (...args: any[]) => mockAddReptileShed(...args),
}));

jest.mock("../measurementsStore", () => ({
  addMeasurement: (...args: any[]) => mockAddMeasurement(...args),
}));

jest.mock("../reptileEventsStore", () => ({
  upsertReptileEvent: (...args: any[]) => mockUpsertReptileEvent(...args),
}));

describe("asyncStorageMigration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("skips when flag is set", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("1");
    await runAsyncStorageMigration();
    expect(AsyncStorage.getAllKeys).not.toHaveBeenCalled();
  });

  it("migrates data and sets flag", async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify([{ id: "r1", name: "A" }]))
      .mockResolvedValueOnce(JSON.stringify([{ reptile_id: "r1" }]))
      .mockResolvedValueOnce(
        JSON.stringify([
          { reptile_id: "r1", url: "data:image/png;base64,AA" },
        ]),
      )
      .mockResolvedValueOnce(
        JSON.stringify([
          { reptile_id: "r1", food_name: "mouse", quantity: 1, fed_at: "2024-01-01" },
        ]),
      )
      .mockResolvedValueOnce(
        JSON.stringify([
          { reptile_id: "r1", shed_date: "2024-01-02", notes: "ok" },
        ]),
      )
      .mockResolvedValueOnce(
        JSON.stringify([
          { reptile_id: "r1", date: "2024-01-03", weight: 10 },
        ]),
      )
      .mockResolvedValueOnce(
        JSON.stringify([
          { id: "e1", event_name: "test", event_date: "2024-01-04" },
        ]),
      );

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([
      "local_reptiles",
      "local_reptile_genetics",
      "local_reptile_photos",
      "local_reptile_feedings_bucket",
      "local_reptile_sheds_bucket",
      "local_reptile_measurements_bucket",
      "local_reptile_events_bucket",
    ]);

    await runAsyncStorageMigration();

    expect(mockUpsertReptile).toHaveBeenCalled();
    expect(mockUpsertReptileGenetics).toHaveBeenCalled();
    expect(mockAddReptilePhotoFromBase64).toHaveBeenCalled();
    expect(mockAddReptileFeeding).toHaveBeenCalled();
    expect(mockAddReptileShed).toHaveBeenCalled();
    expect(mockAddMeasurement).toHaveBeenCalled();
    expect(mockUpsertReptileEvent).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("local_migration_v1_done", "1");
  });

  it("handles invalid JSON and uri photos", async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce("not-json")
      .mockResolvedValueOnce("not-json")
      .mockResolvedValueOnce(
        JSON.stringify([{ reptile_id: "r1", url: "file://photo.jpg" }]),
      );

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([
      "local_reptiles",
      "local_reptile_genetics",
      "local_reptile_photos",
    ]);

    await runAsyncStorageMigration();

    expect(mockAddReptilePhotoFromUri).toHaveBeenCalled();
  });

  it("handles empty keys without errors", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([]);

    await runAsyncStorageMigration();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("local_migration_v1_done", "1");
  });

  it("handles null reptiles payload and photo without url", async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify([{}]));

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([
      "local_reptiles",
      "local_reptile_photos",
    ]);

    await runAsyncStorageMigration();

    expect(mockUpsertReptile).not.toHaveBeenCalled();
    expect(mockAddReptilePhotoFromBase64).not.toHaveBeenCalled();
    expect(mockAddReptilePhotoFromUri).not.toHaveBeenCalled();
  });

  it("handles null bucket payloads", async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null) // flag
      .mockResolvedValueOnce(JSON.stringify([{ id: "r1", name: "A" }])) // reptiles
      .mockResolvedValueOnce(null) // feedings bucket
      .mockResolvedValueOnce(null) // sheds bucket
      .mockResolvedValueOnce(null) // measurements bucket
      .mockResolvedValueOnce(null); // events bucket

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([
      "local_reptiles",
      "local_reptile_feedings_bucket",
      "local_reptile_sheds_bucket",
      "local_reptile_measurements_bucket",
      "local_reptile_events_bucket",
    ]);

    await runAsyncStorageMigration();

    expect(mockUpsertReptile).toHaveBeenCalled();
    expect(mockAddReptileFeeding).not.toHaveBeenCalled();
    expect(mockAddReptileShed).not.toHaveBeenCalled();
    expect(mockAddMeasurement).not.toHaveBeenCalled();
    expect(mockUpsertReptileEvent).not.toHaveBeenCalled();
  });

  it("handles photos null payload and base64 without comma", async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(
        JSON.stringify([{ reptile_id: "r1", url: "data:image/png" }]),
      );

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([
      "local_reptile_photos",
    ]);

    await runAsyncStorageMigration();

    expect(mockAddReptilePhotoFromBase64).toHaveBeenCalled();
  });

  it("handles photos null payload", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([
      "local_reptile_photos",
    ]);

    await runAsyncStorageMigration();

    expect(mockAddReptilePhotoFromBase64).not.toHaveBeenCalled();
    expect(mockAddReptilePhotoFromUri).not.toHaveBeenCalled();
  });
});
