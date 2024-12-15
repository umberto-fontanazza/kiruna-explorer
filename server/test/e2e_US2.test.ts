import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType } from "../src/model/document";
import { LinkType } from "../src/model/link";
import { ScaleType } from "../src/model/scale";
import { Stakeholder } from "../src/model/stakeholder";
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

describe("Testing story 2", () => {
  const sourceDocument1 = {
    title: "Source Document",
    description: "This one will be tested as a source",
    type: DocumentType.Prescriptive,
    scale: { type: ScaleType.Text },
    stakeholders: [Stakeholder.Residents],
    issuanceTime: "2024-12",
  };
  const targetDocument2 = {
    title: "Target Document",
    description: "This one will be tested as a target",
    type: DocumentType.Informative,
    scale: { type: ScaleType.BlueprintsOrEffect },
    stakeholders: [Stakeholder.KirunaKommun],
    issuanceTime: "2021-12-12",
    coordinates: { latitude: 45, longitude: 30 },
  };
  const targetDocument3 = {
    title: "Target Document",
    description: "This one will be tested as a target",
    type: DocumentType.Informative,
    scale: { type: ScaleType.BlueprintsOrEffect },
    stakeholders: [Stakeholder.KirunaKommun],
    issuanceTime: "2021-12-11",
    coordinates: { latitude: 35, longitude: 30 },
  };
  let sourceDocumentId1: number;
  let targetDocumentId2: number;
  let targetDocumentId3: number;

  test("US1.2 POST Document 1", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...sourceDocument1 });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    sourceDocumentId1 = response.body.id;
  });

  test("US1.2 POST Document 2", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...targetDocument2 });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    targetDocumentId2 = response.body.id;
  });

  test("US1.2 POST Document 3", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...targetDocument3 });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    targetDocumentId3 = response.body.id;
  });

  test("US2.1 PUT link documents without being Urban Planner", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .send({
        targetDocumentId: targetDocumentId2,
        linkTypes: [LinkType.Direct],
      });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US2.2 PUT link documents", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({
        targetDocumentId: targetDocumentId2,
        linkTypes: [LinkType.Direct],
      });
    expect(response.status).toStrictEqual(StatusCodes.CREATED);
  });

  test("US2.3 PUT link documents updating link", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({
        targetDocumentId: targetDocumentId2,
        linkTypes: [LinkType.Collateral],
      });
    expect(response.status).toStrictEqual(StatusCodes.CREATED);
  });

  test("US2.4 PUT link documents for a non existing document", async () => {
    const response = await request(app)
      .put("/documents/0/links")
      .set("Cookie", plannerCookie)
      .send({
        targetDocumentId: targetDocumentId2,
        linkTypes: [LinkType.Direct],
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.5 PUT link documents with wrong link type", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({ targetDocumentId: targetDocumentId2, linkTypes: ["Wrong type"] });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.5 PUT link documents with wrong link type", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({ targetDocumentId: targetDocumentId2, linkTypes: [123] });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.6 PUT link documents with wrong target document", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({ targetDocumentId: 0, linkTypes: [LinkType.Projection] });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.6 PUT link documents with wrong target document", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({ targetDocumentId: "Wrong", linkTypes: [LinkType.Direct] });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.7 PUT link documents without link types", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({ targetDocumentId: targetDocumentId2 });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.8 PUT link documents without target document", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({ linkTypes: [LinkType.Direct] });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.9 PUT link documents to the same document", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({
        targetDocumentId: sourceDocumentId1,
        linkTypes: [LinkType.Direct],
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.10 GET links for a document as Visitor", async () => {
    const response = await request(app).get(
      `/documents/${sourceDocumentId1}/links`,
    );
    expect(response.status).toStrictEqual(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
  });

  test("US2.11 GET links for a document as Urban Planner", async () => {
    const response = await request(app)
      .get(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
  });

  test("US2.12 GET links for a non existing document", async () => {
    const response = await request(app)
      .get("/documents/0/links")
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US2.13 DELETE link between documents without being Urban Planner", async () => {
    const response = await request(app).delete(
      `/documents/${sourceDocumentId1}/links`,
    );
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US2.2 PUT link documents", async () => {
    const response = await request(app)
      .put(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie)
      .send({
        targetDocumentId: targetDocumentId3,
        linkTypes: [LinkType.Projection],
      });
    expect(response.status).toStrictEqual(StatusCodes.CREATED);
  });

  test("US2.11 GET links for a document after creating another one", async () => {
    const response = await request(app)
      .get(`/documents/${sourceDocumentId1}/links`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toStrictEqual([
      { linkTypes: ["collateral"], targetDocumentId: targetDocumentId2 },
      { linkTypes: ["projection"], targetDocumentId: targetDocumentId3 },
    ]);
  });

  test("US1.19 DELETE an existing document", async () => {
    const response = await request(app)
      .del(`/documents/${sourceDocumentId1}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);

    await request(app)
      .del(`/documents/${targetDocumentId2}`)
      .set("Cookie", plannerCookie);
    await request(app)
      .del(`/documents/${targetDocumentId3}`)
      .set("Cookie", plannerCookie);
  });
});

