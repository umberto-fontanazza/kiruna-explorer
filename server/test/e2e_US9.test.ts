import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { countEntriesInTable, loginAsPlanner } from "./utils";

let documentId: number;
let plannerCookie: string;
const validDocument = {
  title: "Area test document",
  description:
    "This document was create to test insertion and retrieval of documents with areas",
  type: DocumentType.Informative,
  scale: { type: ScaleType.BlueprintsOrEffect },
  issuanceTime: "2024-12",
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
      { latitude: 67.8475000000006, longitude: 20.22800000000036 },
    ],
    [
      { latitude: 67.85800000000079, longitude: 20.22000000000075 },
      { latitude: 67.86000000000089, longitude: 20.22600000000036 },
      { latitude: 67.85750000000003, longitude: 20.23000000000058 },
    ],
  ],
};

let initPolygonCount: number = 0;
let initAreaCount: number = 0;

const validCoordinates = {
  latitude: 67.85800000000079,
  longitude: 20.22000000000075,
};

beforeAll(async () => {
  initAreaCount = await countEntriesInTable("area");
  initPolygonCount = await countEntriesInTable("polygon");
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  const finalAreaCount = await countEntriesInTable("area");
  if (finalAreaCount !== initAreaCount) {
    console.warn(`The count of area was altered by the tests`);
  }
  const finalPolygonCount: number = await countEntriesInTable("polygon");
  if (finalPolygonCount !== initPolygonCount) {
    console.warn(`The count of polygon was altered by the tests`);
  }
  await Database.disconnect();
});

describe("Document with area BAD REQUEST", () => {
  test("US 9.1 POST a document with area AND coordinates, as urban planner", async () => {
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

  test("US 9.2 POST a document with area AND coordinates, as visitor", async () => {
    const response = await request(app)
      .post("/documents")
      .send({
        ...validDocument,
        coordinates: validCoordinates,
        area: validAreaBody,
      });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US 9.3 POST Area without include field, as Urban planner", async () => {
    const response = await request(app)
      .post("/documents")
      .send({
        ...validDocument,
        area: { ...validAreaBody, include: undefined },
      })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 9.4 POST Area without exclude field, as Urban planner", async () => {
    const response = await request(app)
      .post("/documents")
      .send({
        ...validDocument,
        area: { ...validAreaBody, exclude: undefined },
      })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 9.5 POST Create a document with valid area, but without being urban planner", async () => {
    const response = await request(app)
      .post("/documents")
      .send({
        ...validDocument,
        area: validAreaBody,
      });
    documentId = response.body.id;
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });
});

describe("Testing areas for document router", () => {
  test("US 9.6 POST a document with valid area, as Urban planner", async () => {
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

  test("US 9.7 GET the document just created", async () => {
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

  test("US 9.8 GET the document just created, as Urban planner", async () => {
    const response = await request(app)
      .get(`/documents/${documentId}`)
      .set("Cookie", plannerCookie);
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

  test("US 9.9 PATCH said document", async () => {
    const { include } = validAreaBody;
    const patchedInclude = [...include, { latitude: 67.87, longitude: 20.24 }];
    const patchedAreaBody = { ...validAreaBody, include: patchedInclude };
    const response = await request(app)
      .patch(`/documents/${documentId}`)
      .send({ area: patchedAreaBody })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US 9.10 PATCH said document, as visitor", async () => {
    const { include } = validAreaBody;
    const patchedInclude = [...include, { latitude: 67.87, longitude: 20.24 }];
    const patchedAreaBody = { ...validAreaBody, include: patchedInclude };
    const response = await request(app)
      .patch(`/documents/${documentId}`)
      .send({ area: patchedAreaBody });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US 9.11 PATCH said document, with invalid area", async () => {
    const response = await request(app)
      .patch(`/documents/${documentId}`)
      .send({ area: { include: "invalid" } })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 9.12 PATCH said document, with area and coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${documentId}`)
      .send({ area: validAreaBody, coordinates: validCoordinates })
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US 9.13 DELETE document", async () => {
    const response = await request(app)
      .delete(`/documents/${documentId}`)
      .send()
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });
});
