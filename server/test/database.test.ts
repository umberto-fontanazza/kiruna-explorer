import dotenv from "dotenv";
import { Pool, types } from "pg";
import { Database } from "../src/database";
dotenv.config();

jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
  };

  const mTypes = {
    setTypeParser: jest.fn(),
  };

  return { Pool: jest.fn(() => mPool), types: mTypes };
});

describe("Database", () => {
  const poolMock: Pool = new Pool();
  const queryMock = poolMock.query as jest.Mock;
  const setTypeParserMock = types.setTypeParser as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await Database.disconnect();
  });

  it("should initialize the pool with correct configuration", () => {
    Database.setup();

    const port = parseInt(process.env.DB_PORT || "5432");
    expect(Pool).toHaveBeenCalledWith({
      host: process.env.DB_HOST,
      port: port,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_TEST_NAME,
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

    expect(queryMock).toHaveBeenCalledWith("SELECT * FROM users", undefined);
    expect(result).toEqual(mockResult);
  });

  it("should call setTypeParser during setup", () => {
    Database.setup();

    expect(setTypeParserMock).toHaveBeenCalledWith(58509, expect.any(Function));
  });
});
