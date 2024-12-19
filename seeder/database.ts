import { strict as assert } from "assert";
import dotenv from "dotenv";
import { Pool, PoolClient, QueryResult, types } from "pg";

dotenv.config();

let pool: Pool | undefined;

export class Database {
  static setup() {
    // 58509 is the OID for type _stakeholder(array of type staholder) in our postgres database
    types.setTypeParser(58509, (val) => {
      const parsed = val.slice(1, -1).split(",");

      if (parsed.length === 1 && parsed[0] === "") {
        return [];
      }

      return parsed;
    });

    const dbName = process.env.DB_NAME;

    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
    });
  }

  static async getClient(): Promise<PoolClient> {
    if (!pool) Database.setup();
    assert(pool);
    return await pool.connect();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async query(text: string, values?: any[]): Promise<QueryResult<any>> {
    if (!pool) Database.setup();
    assert(pool);
    return await pool.query(text, values);
  }

  static async withTransaction<T>(
    action: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await Database.getClient();
    try {
      await client.query("BEGIN");
      const result = await action(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async disconnect(): Promise<void> {
    assert(pool);
    await pool.end();
  }
}
