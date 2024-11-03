import dotenv from "dotenv";
dotenv.config(); //TODO: remove and fix
import app from "../src/app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { Database } from "../src/database";

afterAll(async () => {
  await Database.disconnect();
});

describe("Document CRUD with just title and description", () => {
  let testDocumentId: number;

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
    const response = await request(app).del(`/documents/${testDocumentId}`);
    expect(response.status).toEqual(StatusCodes.NO_CONTENT);
  });
});
