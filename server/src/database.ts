import { strict as assert } from "assert";
import { Pool, QueryResult, types } from "pg";

let pool: Pool | undefined;

//TODO: this needs refactoring
export class Database {
  static setup() {
    const env = process.env.NODE_ENV
      ? process.env.NODE_ENV.trim()
      : "development";

    // 58509 is the OID for type _stakeholder(array of type staholder) in our postgres database
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
async function deleteAllDocuments(): Promise<void> {
  try {
    const connection = getConnection();
    await connection.getRepository(Document).delete({});
    console.log("All documents deleted.");
  } catch (error) {
    console.error("Error deleting documents:", error.message);
    process.exit(1);
  }
}
//seed
async function seedDocuments(): Promise<void> {
  const documents = Array.from({ length: 50 }).map(() => ({
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    type: faker.random.arrayElement([
      "informative",
      "prescriptive",
      "design",
      "technical",
    ]),
    scale: {
      type: "ratio",
      ratio: faker.datatype.number({ min: 1000, max: 10000 }),
    },
    stakeholders: [faker.company.companyName(), faker.company.companyName()],
    coordinates: {
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude()),
    },
    issuanceTime: faker.date.past(),
  }));

  try {
    const connection = getConnection();
    await connection.getRepository(Document).save(documents);
    console.log("50 documents seeded successfully.");
  } catch (error) {
    console.error("Error seeding documents:", error.message);
    process.exit(1);
  }
}

async function seedDatabase(): Promise<void> {
  try {
    await createConnection();
    console.log("Connected to the database.");

    await deleteAllDocuments();
    await seedDocuments();

    await getConnection().close();
    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error during seeding process:", error.message);
    process.exit(1);
  }
}
seedDatabase();
