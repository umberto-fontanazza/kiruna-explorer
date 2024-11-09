import dotenv from "dotenv";
dotenv.config(); //TODO: remove and fix
import app from "../src/app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { Database } from "../src/database";
import { DocumentType, Scale } from "../src/model/document";

/**
 * TODO: when adding AUTH a cookie needs to be created first otherwise requests will not fail with BAD_REQUEST
 * but with UNAUTHORIZED or something similar instead
 */

afterAll(async () => {
  await Database.disconnect();
});

// describe("Document CRUD success with just title and description", () => {
//   let testDocumentId: number;

//   test("POST returning the id", async () => {
//     const response = await request(app).post("/documents/").send({
//       title: "test-document",
//       description: "Simple test description",
//     });
//     expect(response.status).toEqual(StatusCodes.CREATED);
//     expect(response.body.id).toBeDefined();
//     expect(typeof response.body.id).toEqual("number");
//     testDocumentId = response.body.id;
//   });

//   test("GET the newly created document", async () => {
//     const response = await request(app).get(`/documents/${testDocumentId}`);
//     expect(response.status).toEqual(StatusCodes.OK);
//     expect(response.body.id).toBeDefined();
//     expect(response.body.title).toBeDefined();
//     expect(response.body.description).toBeDefined();
//   });

//   test("UPDATE the document", async () => {
//     const updateDescription = "New updated test description";
//     const response = await request(app)
//       .patch(`/documents/${testDocumentId}`)
//       .send({
//         description: updateDescription,
//       });
//     expect(response.status).toEqual(StatusCodes.NO_CONTENT);
//     const response2 = await request(app).get(`/documents/${testDocumentId}`);
//     expect(response2.body.description).toBeDefined();
//     expect(response2.body.description).toStrictEqual(updateDescription);
//   });

//   test("DELETE the document", async () => {
//     const response = await request(app).delete(`/documents/${testDocumentId}`);
//     expect(response.status).toEqual(StatusCodes.NO_CONTENT);
//   });
// });

describe("Document CRUD bad requests", () => {
  test("GET with wrong ID", async () => {
    const response = await request(app).get("/documents/-1");
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("POST without a title", async () => {
    const response = await request(app).post("/documents/").send({
      description: "Nice description but the title is missing",
    });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("POST without description", async () => {
    const response = await request(app).post("/documents/").send({
      title: "Nice title but no desc",
    });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("PATCH with negative id", async () => {
    const response = await request(app).patch("/documents/-1").send({
      description: "New shiny description",
    });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("DELETE with id = 0", async () => {
    const response = await request(app).delete("/documents/0");
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });
});

describe("Testing with coordinates", () => {
  const testDoc = {
    title: "Coordinates test",
    description: "This one will be tested with coordinates",
    scale: Scale.Text,
    type: DocumentType.Informative,
    language: "italian",
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
      .send({ ...testDoc, wrongCoordinates });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("POST with incomplete coordinates", async () => {
    const response = await request(app)
      .post("/documents/")
      .send({ ...testDoc, missingLat });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("POST with coordinates success", async () => {
    const response = await request(app)
      .post("/documents/")
      .send({ ...testDoc, coordinates });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocId = response.body.id;
  });

  test("DELETE with coordinates success", async () => {
    const response = await request(app).del(`/documents/${testDocId}`);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });
});
