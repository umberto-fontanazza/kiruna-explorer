import { Pool, QueryResult, types } from "pg";
import { strict as assert } from "assert";

let pool: Pool | undefined;

//TODO: this needs refactoring
export class Database {
  static setup() {
    const env = process.env.NODE_ENV
      ? process.env.NODE_ENV.trim()
      : "development";

    types.setTypeParser(58509, (val) => {
      return val === null ? null : val.slice(1, -1).split(",");
    });

    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database:
        env === "development" ? process.env.DB_NAME : process.env.DB_TEST_NAME,
    });
  }

  static async disconnect(): Promise<void> {
    assert(pool);
    await pool.end();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async query(text: string, values?: any[]): Promise<QueryResult<any>> {
    if (!pool) Database.setup();
    assert(pool);
    return await pool.query(text, values);
  }
}
