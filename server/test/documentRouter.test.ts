import dotenv from "dotenv";
dotenv.config(); //TODO: remove and fix
import app from "../src/app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { Database } from "../src/database";

/**
 * TODO: when adding AUTH a cookie needs to be created first otherwise requests will not fail with BAD_REQUEST
 * but with UNAUTHORIZED or something similar instead
 */

afterAll(async () => {
  await Database.disconnect();
});

describe("Document CRUD success with just title and description", () => {
  let testDocumentId: number;

  console.log(process.env);

  test("POST returning the id", async () => {
    const response = await request(app).post("/documents/").send({
      title: "test-document",
      description: "Simple test description",
    });
    expect(response.status).toEqual(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toEqual("number");
    testDocumentId = response.body.id;
  });

  test("GET the newly created document", async () => {
    const response = await request(app).get(`/documents/${testDocumentId}`);
    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBeDefined();
    expect(response.body.description).toBeDefined();
  });

  test("UPDATE the document", async () => {
    const updateDescription = "New updated test description";
    const response = await request(app)
      .patch(`/documents/${testDocumentId}`)
      .send({
        description: updateDescription,
      });
    expect(response.status).toEqual(StatusCodes.NO_CONTENT);
    const response2 = await request(app).get(`/documents/${testDocumentId}`);
    expect(response2.body.description).toBeDefined();
    expect(response2.body.description).toStrictEqual(updateDescription);
  });

  test("DELETE the document", async () => {
    const response = await request(app).delete(`/documents/${testDocumentId}`);
    expect(response.status).toEqual(StatusCodes.NO_CONTENT);
  });
});

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
