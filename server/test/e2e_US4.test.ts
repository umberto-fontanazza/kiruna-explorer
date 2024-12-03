import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType, Stakeholder } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { loginAsPlanner, loginAsResident } from "./utils";
dotenv.config();

// End to end testing for user stroy 4
let plannerCookie: string;
let residentCookie: string;

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Database.disconnect();
});

describe("Testing story 4", () => {
  const testUS4 = {
    title: "Story 4 test",
    description: "This one will be tested for story 4",
    type: DocumentType.Informative,
    scale: { type: ScaleType.BlueprintsOrEffect },
    stakeholders: [Stakeholder.KirunaKommun],
    issuanceDate: "2021-12-12",
    coordinates: { latitude: 45, longitude: 30 },
  };
  let testDocId4: number;

  test("POST with All fields filled", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS4 });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocId4 = response.body.id;
  });

  describe("Urban Planner story 6", () => {
    afterAll(async () => {
      await request(app).delete("/current/");
    });

    test("US 4.1 GET all documents as Urban Planner", async () => {
      const response = await request(app)
        .get("/documents/")
        .set("Cookie", plannerCookie);
      expect(response.status).toStrictEqual(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("US 4.4 GET with ID as a Urban Planner", async () => {
      const response = await request(app)
        .get(`/documents/${testDocId4}`)
        .set("Cookie", plannerCookie);
      expect(response.status).toStrictEqual(StatusCodes.OK);
    });

    test("US 4.7 GET with non existing ID as Urban Planner", async () => {
      const response = await request(app)
        .get("/documents/5")
        .set("Cookie", plannerCookie);
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });

    test("US 4.8 GET with wrong ID as Urban Planner", async () => {
      const response = await request(app)
        .get("/documents/-1")
        .set("Cookie", plannerCookie);
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });
  });

  describe("Visitor", () => {
    test("US 4.2 GET all documents as Visitor", async () => {
      const response = await request(app).get("/documents/");
      expect(response.status).toStrictEqual(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("US 4.5 GET with ID as a Visitor", async () => {
      const response = await request(app).get(`/documents/${testDocId4}`);
      expect(response.status).toStrictEqual(StatusCodes.OK);
    });

    test("US 4.7 GET with non existing ID as Urban Planner", async () => {
      const response = await request(app).get("/documents/5");
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });

    test("US 4.8 GET with wrong ID as Visitor", async () => {
      const response = await request(app).get("/documents/0");
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });
  });

  describe("Resident", () => {
    beforeAll(async () => {
      residentCookie = await loginAsResident();
    });

    test("US 4.3 GET all documents as Resident", async () => {
      const response = await request(app)
        .get("/documents/")
        .set("Cookie", residentCookie);
      expect(response.status).toStrictEqual(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("US 4.6 GET with ID as a Resident", async () => {
      const response = await request(app)
        .get(`/documents/${testDocId4}`)
        .set("Cookie", residentCookie);
      expect(response.status).toStrictEqual(StatusCodes.OK);
    });
    // Verificar si este error esta mal escrito en el documento de document.router
    test("US 4.7 GET with non existing ID as Urban Planner", async () => {
      const response = await request(app)
        .get("/documents/5")
        .set("Cookie", residentCookie);
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });

    test("US 4.8 GET with wrong ID as Resident", async () => {
      const response = await request(app).get("/documents/-20");
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });
  });

  test("DELETE with coordinates success", async () => {
    const response = await request(app)
      .del(`/documents/${testDocId4}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });
});
