import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { Document, DocumentType } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { loginAsPlanner } from "./utils";

let documentId: number;
let plannerCookie: string;
const validDocument = {
  title: "Area test document",
  description:
    "This document was create to test insertion and retrieval of documents with areas",
  type: DocumentType.Informative,
  scale: { type: ScaleType.BlueprintsOrEffect },
};

const validAreaBody = {
  include: [
    { latitude: 67.85584273627312, longitude: 20.22534124638123 },
    { latitude: 67.85971234872345, longitude: 20.21344576372931 },
    { latitude: 67.84217863458723, longitude: 20.24528734962184 },
    { latitude: 67.83997453827193, longitude: 20.23000083719327 },
  ],
  exclude: [
    [
      { latitude: 67.85000000000012, longitude: 20.23500000000034 },
      { latitude: 67.84500000000045, longitude: 20.24000000000082 },
      { latitude: 67.84750000000067, longitude: 20.22800000000036 },
    ],
    [
      { latitude: 67.85800000000079, longitude: 20.22000000000075 },
      { latitude: 67.86000000000089, longitude: 20.22600000000036 },
      { latitude: 67.85750000000003, longitude: 20.23000000000058 },
    ],
  ],
};

const validCoordinates = {
  latitude: 67.85800000000079,
  longitude: 20.22000000000075,
};

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Document.delete(documentId);
  await Database.disconnect();
});

describe("Testing areas for document router", () => {
  test("Create a document with area AND coordinates", async () => {
    const response = await request(app)
      .post("/documents")
      .send({
        ...validDocument,
        coordinates: validCoordinates,
        area: validAreaBody,
      })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("Create a document with malformed area", async () => {
    const response = await request(app)
      .post("/documents")
      .send({
        ...validDocument,
        area: { ...validAreaBody, include: undefined },
      })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("Create a document with valid area", async () => {
    const response = await request(app)
      .post("/documents")
      .send({
        ...validDocument,
        area: validAreaBody,
      })
      .set("Cookie", plannerCookie);
    documentId = response.body.id;
    expect(documentId).toBeDefined();
    expect(response.status).toStrictEqual(StatusCodes.CREATED);
  });

  test("Get the document just created", async () => {
    const response = await request(app).get(`/documents/${documentId}`);
    const receivedDocument = response.body;
    expect(response.status).toStrictEqual(StatusCodes.OK);
    expect(receivedDocument).toBeDefined();
    expect(receivedDocument.area).toBeDefined();
    expect(receivedDocument.coordinates).toBeUndefined();
    const { area } = receivedDocument;
    const { include, exclude } = area;
    expect(include).toBeDefined();
    expect(exclude).toBeDefined();
    expect(JSON.stringify(area)).toStrictEqual(JSON.stringify(validAreaBody));
    expect(JSON.stringify(include)).toStrictEqual(
      JSON.stringify(validAreaBody.include),
    );
    expect(JSON.stringify(exclude)).toStrictEqual(
      JSON.stringify(validAreaBody.exclude),
    );
  });
});
