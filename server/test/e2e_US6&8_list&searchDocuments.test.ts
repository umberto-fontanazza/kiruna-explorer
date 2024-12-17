import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { Stakeholder } from "../src/model/stakeholder";
import { loginAsPlanner } from "./utils";
dotenv.config();

// End to end testing for user story 6: As an Urban Planner, I want to list all documents
// End to end testing for user story 8: As an Urban Planner, I want to search documents so that i can find what i am interested in

let plannerCookie: string;

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Database.disconnect();
});

describe("Testing story 6", () => {
  const testUS6 = {
    title: "Story 6 test",
    description: "This one will be tested for story 6",
    type: DocumentType.Informative,
    scale: { type: ScaleType.BlueprintsOrEffect },
    stakeholders: [Stakeholder.KirunaKommun],
    issuanceTime: "2021-12-12",
    coordinates: { latitude: 45, longitude: 30 },
  };
  let testDocId6: number;

  test("POST with All fields filled", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS6 });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocId6 = response.body.id;
  });

  test("US 6.1 GET all documents as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("US 6.2 GET /documents filtered by type as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .query({ type: DocumentType.Informative })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("US 6.3 GET /documents with scaleType filter", async () => {
    const response = await request(app)
      .get("/documents")
      .query({ scaleType: ScaleType.BlueprintsOrEffect })
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("US 6.4 GET /documents with   issuanceTime filter", async () => {
    const response = await request(app)
      .get("/documents")
      .query({ maxIssuanceDate: "2023-12-31", minIssuanceDate: "2023-01-01" })
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("US 6.5 GET /documents with maxIssuanceDate filter", async () => {
    const response = await request(app)
      .get("/documents")
      .query({ maxIssuanceDate: "2023-12-31" })
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("US 6.6 GET /documents with minIssuanceDate filter", async () => {
    const response = await request(app)
      .get("/documents")
      .query({ minIssuanceDate: "2023-01-01" })
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("US 6.7 GET /documents with Type and   issuanceTime filters", async () => {
    const response = await request(app)
      .get("/documents")
      .query({
        type: DocumentType.Informative,
        maxIssuanceDate: "2023-12-31",
        minIssuanceDate: "2023-01-01",
      })
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("US 6.7 GET /documents with Type and scaleType filters", async () => {
    const response = await request(app)
      .get("/documents")
      .query({
        type: DocumentType.Informative,
        scaleType: ScaleType.BlueprintsOrEffect,
      })
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("6.8 GET /documents with multiple filters", async () => {
    const response = await request(app)
      .get("/documents")
      .query({
        type: DocumentType.Informative,
        scaleType: ScaleType.BlueprintsOrEffect,
        maxIssuanceDate: "2023-12-31",
        minIssuanceDate: "2023-01-01",
      })
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("US 6.9 GET with wrong type as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .query({ type: "Wrong" })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 6.10 GET with wrong scaleType as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .query({ scaleType: "Wrong" })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 6.11 GET with wrong issuanceDate as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .query({ maxIssuanceDate: "Wrong" })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 6.12 GET with wrong issuanceDate as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .query({ minIssuanceDate: "Wrong" })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 6.13 GET with wrong type and scaleType as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .query({ type: "Wrong", scaleType: "Wrong" })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 6.14 GET with wrong type and issuanceDate as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .query({ type: "Wrong", maxIssuanceDate: "Wrong" })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 6.15 GET an empty list of documents as Urban Planner", async () => {
    const response = await request(app)
      .get("/documents/")
      .query({ type: DocumentType.Design })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.OK);
  });

  test("DELETE with coordinates success", async () => {
    const response = await request(app)
      .del(`/documents/${testDocId6}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });
});
