describe("db.web", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("execute uses getAllAsync", async () => {
    const sqlite = require("expo-sqlite/next");
    const db = {
      getAllAsync: jest.fn(async () => [{ id: 1 }]),
      runAsync: jest.fn(async () => {}),
      execAsync: jest.fn(async () => {}),
    };
    sqlite.openDatabaseAsync.mockResolvedValueOnce(db);

    const web = require("../db.web");
    const rows = await web.execute("SELECT * FROM test", [1]);

    expect(db.getAllAsync).toHaveBeenCalledWith("SELECT * FROM test", [1]);
    expect(rows).toEqual([{ id: 1 }]);
  });

  it("executeVoid uses runAsync", async () => {
    const sqlite = require("expo-sqlite/next");
    const db = {
      getAllAsync: jest.fn(async () => []),
      runAsync: jest.fn(async () => {}),
      execAsync: jest.fn(async () => {}),
    };
    sqlite.openDatabaseAsync.mockResolvedValueOnce(db);

    const web = require("../db.web");
    await web.executeVoid("UPDATE test SET a=?", [2]);

    expect(db.runAsync).toHaveBeenCalledWith("UPDATE test SET a=?", [2]);
  });

  it("runMigrations executes schema and ignores alter errors", async () => {
    const sqlite = require("expo-sqlite/next");
    const db = {
      getAllAsync: jest.fn(async () => []),
      runAsync: jest.fn(async () => {}),
      execAsync: jest.fn(async (sql: string) => {
        if (sql.startsWith("ALTER TABLE")) {
          throw new Error("already exists");
        }
      }),
    };
    sqlite.openDatabaseAsync.mockResolvedValueOnce(db);

    const web = require("../db.web");
    await web.runMigrations();

    expect(db.execAsync).toHaveBeenCalled();
  });
});
