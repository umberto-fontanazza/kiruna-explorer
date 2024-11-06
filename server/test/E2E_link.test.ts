import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import { Database } from "../src/database";
import app from "../src/app";

// Tests
describe("Link Router", () => {
    let testDocAID: number;
    let testDocBID: number;

    beforeAll(async () => {
        //Create a new pair of documents
        const DocResponseA = await request(app)
        .post("/documents")
        .send({
        title: "Test Document A",
        description: "This is a test document",
        });
        
        testDocAID = DocResponseA.body.id;

        const DocResponseB = await request(app)
        .post("/documents")
        .send({
        title: "Test Document A",
        description: "This is a test document",
        });
        
        testDocBID = DocResponseB.body.id;
    });
  
    afterAll(async () => {
    //Delete the documents
    await request(app).delete(`/documents/${testDocAID}`);
    await request(app).delete(`/documents/${testDocBID}`);
    await Database.disconnect();
  });

  it("should retrieve all the links associated with a specific document", async () => {
    const response = await request(app).get(`/documents/${testDocAID}/links`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should create or update a link associated with a specific document", async () => {
    const response = await request(app).put(`/documents/${testDocAID}/links`).send({
      targetDocumentId: testDocAID,
      linkTypes: ["Direct"],
    });
    expect(response.status).toBe(201);
  });

  it("should delete a link between two specific documents", async () => {
    const response = await request(app).delete(`/documents/${testDocBID}/link?targetId=${testDocBID}`);
    expect(response.status).toBe(204);
  });
});