import { Database } from "../src/database";
import { Pool } from "pg";

jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe("Database", () => {
  const poolMock: Pool = new Pool();
  const queryMock = poolMock.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5432";
    process.env.DB_USER = "user";
    process.env.DB_PASSWORD = "password";
    process.env.DB_NAME = "testdb";
  });

  afterAll(async () => {
    await Database.disconnect();
  });

  it("should initialize the pool with correct configuration", () => {
    Database.setup();

    expect(Pool).toHaveBeenCalledWith({
      host: process.env.TEST_DB_HOST,
      port: process.env.TEST_DB_PORT,
      user: process.env.TEST_DB_HOST,
      password: process.env.TEST_DB_HOST,
      database: process.env.TEST_DB_HOST,
    });
  });

  it("should call the pool query method", async () => {
    Database.setup();
    const mockResult = { rows: [] };

    queryMock.mockResolvedValue(mockResult);

    const result = await Database.query("SELECT * FROM users");

    expect(queryMock).toHaveBeenCalledWith("SELECT * FROM users", undefined);
    expect(result).toEqual(mockResult);
  });

  it("should end the pool connection on disconnect", async () => {
    Database.setup();

    await Database.disconnect();

    expect(poolMock.end).toHaveBeenCalled();
  });

  it("should call setup if pool is not initialized when querying", async () => {
    const mockResult = { rows: [] };
    queryMock.mockResolvedValue(mockResult);

    await Database.disconnect();

    const result = await Database.query("SELECT * FROM users");

    expect(Pool).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenCalledWith("SELECT * FROM users", undefined);
    expect(result).toEqual(mockResult);
  });
});
