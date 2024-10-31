import { Client, Pool, QueryResult } from "pg";
import { strict as assert } from "assert";

let pool: Pool;
let client: Client;
let setupDone = false;
let poolConnected = false;
let clientConnected = false;

//TODO: this needs refactoring
export class Database {
  static setup() {
    assert(setupDone === false);
    const config = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
    pool = new Pool(config);
    client = new Client(config);
    setupDone = true;
  }

  static async connect(config: "pool" | "client" = "pool"): Promise<void> {
    if (setupDone === false) Database.setup();
    if (config === "pool") {
      assert(poolConnected === false);
      await pool.connect();
      poolConnected = true;
    } else if (config === "client") {
      assert(clientConnected === false);
      await client.connect();
      clientConnected = true;
    }
  }

  static async disconnect(config: "pool" | "client"): Promise<void> {
    if (!setupDone) return;
    if (config === "pool") {
      assert(poolConnected === true);
      await pool.end();
      poolConnected = false;
    } else if (config === "client") {
      assert(clientConnected === true);
      await client.end();
      clientConnected = false;
    }
  }

  /**
   * WARNING! DO NOT USE FOR TRANSACTIONS
   * https://node-postgres.com/apis/pool#:~:text=Do%20not%20use,read%20transactions%20.
   * @param sqlText
   * @param values
   * @returns
   */
  static async query(
    sqlText: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<QueryResult<any>> {
    if (!poolConnected) await Database.connect();
    return await pool.query(sqlText, values);
  }

  static async transaction(
    sqlText: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<QueryResult<any>> {
    if (!clientConnected) await Database.connect("client");
    return await client.query(`BEGIN;\n${sqlText}\nCOMMIT;`, values);
  }
}
