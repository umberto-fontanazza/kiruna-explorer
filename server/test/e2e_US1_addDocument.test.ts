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

// End to end testing: As an Urban Planner, I want to add a new document description
let plannerCookie: string;

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Database.disconnect();
});

describe("Testing story 1", () => {
  const testDocMandatoryFields1 = {
    title: "Mandatory Fields test",
    description: "This one will be tested for mandatory fields",
    type: DocumentType.Prescriptive,
    scale: { type: ScaleType.Text },
    issuanceTime: "2024-12",
  };
  const testDocAllFields1 = {
    ...testDocMandatoryFields1,
    stakeholders: [Stakeholder.KirunaKommun],
    coordinates: { latitude: 45, longitude: 30 },
  };
  let testDocId1: number;
  let testDocIdAll1: number;

  test("US1.1 POST a document without being Urban Planner", async () => {
    const response = await request(app)
      .post("/documents/")
      .send({ ...testDocMandatoryFields1 });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US1.2 POST with All fields filled", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDocAllFields1 });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocIdAll1 = response.body.id;
  });

  test("US1.3 POST with only mandatory fields filled", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDocMandatoryFields1 });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocId1 = response.body.id;
  });

  test("US1.4 POST without a title", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        description: "Nice description but the title is missing",
        type: DocumentType.Prescriptive,
        scale: { type: ScaleType.Text },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.5 POST missing several mandatory fields", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: 45, longitude: 30 },
        stakeholders: [Stakeholder.KirunaKommun],
        issuanceTime: "2021-12-12",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.6 POST missing all fields", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({});
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.7 POST with wrong type", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Title",
        description: "Description",
        type: "Wrong type",
        scale: { type: ScaleType.Text },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.7 POST with wrong description", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Title",
        description: 123,
        type: "Wrong type",
        scale: { type: ScaleType.Text },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.7 POST with wrong Title", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: 123,
        description: "description",
        type: "Wrong type",
        scale: { type: ScaleType.Text },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.7 POST with wrong Scale", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Title",
        description: "description",
        type: "Wrong type",
        scale: { type: "Wrong scale" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.8 POST with fillin wrong all fields", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: 123,
        description: 123,
        type: "Wrong type",
        scale: { type: "Wrong scale" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.9 PATCH without being an Urban Planner", async () => {
    const response = await request(app)
      .patch("/documents/1")
      .send({ description: "New shiny description" });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US1.10 PATCH all editable fields", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        title: "New title",
        description: "This one will be tested for all fields",
        type: DocumentType.Design,
        scale: { type: ScaleType.BlueprintsOrEffect },
        stakeholders: [Stakeholder.Lkab],
        issuanceTime: "2021-12-30",
        coordinates: { latitude: 20, longitude: 40 },
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.11 PATCH only the mandatory fields", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        title: "New title",
        description: "This one will be tested for all fields",
        type: DocumentType.Design,
        scale: { type: ScaleType.ArchitecturalScale, ratio: 1 },
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.12 PATCH  all optional fields", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        stakeholders: [Stakeholder.Residents],
        issuanceTime: "2023-12-30",
        coordinates: { latitude: 20, longitude: 40 },
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.13 PATCH just one mandatory field", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        description: "New shiny description",
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.14 PATCH just one optional field", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        stakeholders: [Stakeholder.WhiteArkitekter],
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.15 PATCH without modify anything", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({});
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.16.3 PATCH with wrong id, not created document", async () => {
    const response = await request(app)
      .patch("/documents/5")
      .set("Cookie", plannerCookie)
      .send({
        description: "Wrong id",
      });
    expect(response.status).toStrictEqual(StatusCodes.NOT_FOUND);
  });

  test("US1.17 PATCH with wrong type", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        type: "Wrong type",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong description", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        description: 123,
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong title", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        title: 123,
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong scale", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        scale: { type: "Wrong scale" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong stakeholders", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        stakeholders: ["Wrong stakeholder"],
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong   issuanceTime", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        issuanceTime: "Wrong date",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: 120, longitude: 40 },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: 45 },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { longitude: 60 },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: "Wrong", longitude: 60 },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: 45, longitude: "Wrong" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: "Wrong", longitude: "Wrong" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.18 DELETE without being an Urban Planner", async () => {
    const response = await request(app).delete(`/documents/${testDocId1}`);
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US1.19 DELETE an existing document", async () => {
    const response = await request(app)
      .del(`/documents/${testDocId1}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);

    await request(app)
      .del(`/documents/${testDocIdAll1}`)
      .set("Cookie", plannerCookie);
  });
});
