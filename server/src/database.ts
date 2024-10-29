import { Pool, QueryResult } from "pg";
import { strict as assert } from "assert";

let pool: Pool;
let connected: boolean | undefined;

export class Database {
  static setup() {
    assert(connected === undefined);
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    connected = false;
  }

  static async connect(): Promise<void> {
    if (connected === undefined) Database.setup();
    assert(connected === false);
    await pool.connect();
    connected = true;
  }

  static async disconnect(): Promise<void> {
    assert(connected === true);
    await pool.end();
    connected = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async query(text: string, values?: any[]): Promise<QueryResult<any>> {
    if (!connected) await Database.connect();
    return await pool.query(text, values);
  }
}
