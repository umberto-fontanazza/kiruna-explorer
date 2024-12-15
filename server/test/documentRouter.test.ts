import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { loginAsPlanner } from "./utils";
dotenv.config(); //TODO: remove and fix

let plannerCookie: string;

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Database.disconnect();
});

describe("Document CRUD bad requests", () => {
  test("GET with wrong ID", async () => {
    const response = await request(app)
      .get("/documents/-1")
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("POST without a title", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        description: "Nice description but the title is missing",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("POST without description", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Nice title but no desc",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("PATCH with negative id", async () => {
    const response = await request(app)
      .patch("/documents/-1")
      .set("Cookie", plannerCookie)
      .send({
        description: "New shiny description",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("DELETE with id = 0", async () => {
    const response = await request(app)
      .delete("/documents/0")
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });
});

describe("Testing with coordinates", () => {
  const testDoc = {
    title: "Coordinates test",
    description: "This one will be tested with coordinates",
    type: DocumentType.Informative,
    scale: { type: ScaleType.BlueprintsOrEffect },
    issuanceTime: "2024-12",
  };
  const wrongCoordinates = {
    latitude: 120,
    longitude: 40,
  };
  const missingLat = {
    longitude: 60,
  };
  const coordinates = {
    latitude: 45,
    longitude: 30,
  };
  let testDocId: number;

  test("POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, wrongCoordinates });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("POST with incomplete coordinates", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, missingLat });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("POST with coordinates success", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, coordinates });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocId = response.body.id;
  });

  test("DELETE with coordinates success", async () => {
    const response = await request(app)
      .del(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });
});

describe("GET /documents filters", () => {
  test("minIssuanceDate > maxIssuanceDate is a bad request", async () => {
    const response = await request(app).get(
      `/documents/?minIssuanceDate=2024-01-01&maxIssuanceDate=2023-12-31`,
    );
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("minIssuanceDate == maxIssuanceDate is a valid request", async () => {
    const response = await request(app).get(
      `/documents/?minIssuanceDate=2024-01-01&maxIssuanceDate=2024-01-01`,
    );
    expect(response.status).toStrictEqual(StatusCodes.OK);
  });
});
