import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import { Database } from "../src/database";
import app from "../src/app";
import { StatusCodes } from "http-status-codes";

// Tests
describe("Link Router", () => {
  let testDocID_A: number;
  let testDocID_B: number;

  beforeAll(async () => {
    //Create a new pair of documents
    const DocResponseA = await request(app).post("/documents").send({
      title: "Test Document A",
      description: "This is a test document",
    });

    testDocID_A = DocResponseA.body.id;

    const DocResponseB = await request(app).post("/documents").send({
      title: "Test Document A",
      description: "This is a test document",
    });

    testDocID_B = DocResponseB.body.id;
  });

  afterAll(async () => {
    //Delete the documents
    await request(app).delete(`/documents/${testDocID_A}`);
    await request(app).delete(`/documents/${testDocID_B}`);
    await Database.disconnect();
  });

  it("should retrieve all the links associated with a specific document", async () => {
    const response = await request(app).get(`/documents/${testDocID_A}/links`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should create or update a link associated with a specific document", async () => {
    const response = await request(app)
      .put(`/documents/${testDocID_A}/links`)
      .send({
        targetDocumentId: testDocID_A,
        linkTypes: ["DIRECT"],
      });
    expect(response.status).toBe(StatusCodes.CREATED);
  });

  it("should delete a link between two specific documents", async () => {
    const response = await request(app)
      .delete(`/documents/${testDocID_B}/links`)
      .query({ targetId: testDocID_A });
    expect(response.status).toBe(StatusCodes.NO_CONTENT);
  });
});
