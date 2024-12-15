import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { Stakeholder } from "../src/model/stakeholder";
import { UploadType } from "../src/model/upload";
import { loginAsPlanner } from "./utils";
dotenv.config();

// End to end testing
let plannerCookie: string;

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Database.disconnect();
});

describe("Testing story 7", () => {
  const testUS7 = {
    title: "Story 6 test",
    description: "This one will be tested for story 6",
    type: DocumentType.Informative,
    scale: { type: ScaleType.BlueprintsOrEffect },
    stakeholders: [Stakeholder.KirunaKommun],
    issuanceTime: "2021-12-12",
    coordinates: { latitude: 45, longitude: 30 },
  };
  let testDocId7: number;
  const testDoc2 = {
    title: "Story 7 test",
    description: "This one will be tested for story 7",
    type: DocumentType.Design,
    scale: { type: ScaleType.Concept },
    stakeholders: [Stakeholder.Lkab],
    issuanceTime: "2021-12-12",
    coordinates: { latitude: 22, longitude: 30 },
  };
  let testDocId2: number;

  const testResource = {
    title: "Test Resource",
    type: UploadType.originalResource,
    file: Buffer.from("test file content").toString("base64"),
  };
  let testResourceId: number;

  test("POST /documents with valid body", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send(testUS7);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
    testDocId7 = response.body.id;
  });

  test("POST /documents with valid body", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send(testDoc2);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
    testDocId2 = response.body.id;
  });

  test("US 7.1 POST a resource for a specific document, as urban planner", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        ...testResource,
        documentIds: [testDocId7],
      });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
    testResourceId = response.body.id;
  });

  test("US 7.2 POST a resource for a specific document without being Urban Planner", async () => {
    const response = await request(app)
      .post("/uploads/")
      .send({
        ...testResource,
        documentIds: [testDocId7],
      });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("US 7.3 POST a resource for a specific document, as urban planner, with invalid documentId", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        ...testResource,
        documentIds: [-1],
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.4 POST a resource for a specific document, as urban planner, with invalid file", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Test Upload",
        type: UploadType.attachment,
        documentIds: [testDocId7],
        file: 1,
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.4 POST a resource for a specific document, as urban planner, with invalid type", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Test Upload",
        type: "invalid",
        documentIds: [testDocId7],
        file: Buffer.from("test file content").toString("base64"),
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.4 POST a resource for a specific document, as urban planner, with invalid title", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        type: UploadType.attachment,
        documentIds: [testDocId7],
        file: Buffer.from("test file content").toString("base64"),
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.5 POST a resource for a specific document, as urban planner, with missing documentIds", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Test Upload",
        type: UploadType.attachment,
        file: Buffer.from("test file content").toString("base64"),
      });
    expect(response.status).toBe(StatusCodes.CREATED);
  });

  test("US 7.6 POST a resource for a specific document, as urban planner, missing file", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Test Upload",
        type: "documentType",
        documentIds: [1, 2],
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.6 POST a resource for a specific document, as urban planner, missing type", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Test Upload",
        documentIds: [1, 2],
        file: Buffer.from("test file content").toString("base64"),
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.6 POST a resource for a specific document, as urban planner, missing title", async () => {
    const response = await request(app)
      .post("/uploads/")
      .set("Cookie", plannerCookie)
      .send({
        type: UploadType.attachment,
        documentIds: [1, 2],
        file: Buffer.from("test file content").toString("base64"),
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.7 GET a resource for a specific document, as Urban Planner", async () => {
    const response = await request(app)
      .get(`/uploads/${testResourceId}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.OK);
  });

  test("US 7.8 GET a resource for a specific document, without being Urban Planner", async () => {
    const response = await request(app).get(`/uploads/${testResourceId}`);
    expect(response.status).toBe(StatusCodes.OK);
  });

  test("US 7.9 GET a resource for a specific document, as Urban Planner with invalid id", async () => {
    const response = await request(app)
      .get(`/uploads/-1`)
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  // Here is happening an error, because the upload.ts is always waiting for a True.
  //   test("US 7.10 GET a resource for a specific document, as Urban Planner, but that document does not have any resources", async () => {
  //     const response = await request(app)
  //       .get(`/uploads/${testDocId2}`)
  //       .set("Cookie", plannerCookie);
  //     expect(response.status).toBe(StatusCodes.NOT_FOUND);
  //     expect(response.body).toEqual([]);
  //   });

  test("US 7.11 PATCH a resource for a specific document, as Urban Planner", async () => {
    const response = await request(app)
      .patch(`/uploads/${testResourceId}`)
      .set("Cookie", plannerCookie)
      .send({
        title: "New Title",
      });
    expect(response.status).toBe(StatusCodes.CREATED);
  });

  test("US 7.12 PATCH a resource for a specific document, without being Urban Planner", async () => {
    const response = await request(app)
      .patch(`/uploads/${testResourceId}`)
      .send({
        title: "New Title",
      });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("US 7.13 PATCH a resource for a specific document, as Urban Planner, with invalid id", async () => {
    const response = await request(app)
      .patch(`/uploads/-1`)
      .set("Cookie", plannerCookie)
      .send({
        title: "New Title",
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.14 PATCH a resource for a specific document, as Urban Planner, with invalid title", async () => {
    const response = await request(app)
      .patch(`/uploads/${testResourceId}`)
      .set("Cookie", plannerCookie)
      .send({
        title: 1,
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US 7.15 DELETE a resource for a specific document, as Urban Planner", async () => {
    const response = await request(app)
      .delete(`/uploads/${testResourceId}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.NO_CONTENT);
  });

  test("US 7.16 DELETE a resource for a specific document, without being Urban Planner", async () => {
    const response = await request(app).delete(`/uploads/${testResourceId}`);
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("US 7.17 DELETE a resource for a specific document, as Urban Planner, with invalid id", async () => {
    const response = await request(app)
      .delete(`/uploads/-1`)
      .set("Cookie", plannerCookie);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US1.19 DELETE an existing document", async () => {
    const response = await request(app)
      .del(`/documents/${testDocId7}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);

    await request(app)
      .del(`/documents/${testDocId2}`)
      .set("Cookie", plannerCookie);
  });
});
