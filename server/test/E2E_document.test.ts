import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import { Database } from "../src/database";
import app from "../src/app";
import { StatusCodes } from "http-status-codes";

// Tests
describe("API End-to-End Tests", () => {
  afterAll(async() => {
    //await Database.disconnect();
  });

  let testDocID: number;

  it("should create a new document", async () => {
    const response = await request(app)
      .post("/documents")
      .send({
        title: "Test Document",
        description: "This is a test document",
      });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(typeof response.body.id).toEqual("number");
    testDocID = response.body.id;
  });

  it("should retrieve all documents", async () => {
    const response = await request(app).get("/documents");
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should retrieve a specific document", async () => {
    const response = await request(app).get(`/documents/${testDocID}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.id).toBe(testDocID);
  });

  it("should update a document", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocID}`)
      .send({ title: "Updated Test Document" });
    expect(response.status).toBe(StatusCodes.NO_CONTENT);

    const updatedResponse = await request(app).get(`/documents/${testDocID}`);
    expect(updatedResponse.body.title).toBe("Updated Test Document");
  });

  it("should delete a document", async () => {
    const response = await request(app).delete(`/documents/${testDocID}`);
    expect(response.status).toBe(StatusCodes.NO_CONTENT);
  });
});


describe("API End-to-End Error Tests", () => {
   afterAll(async() => {
     await Database.disconnect();
   });
   //describe("GET /documents", () => {
     // it("should return 401 when user is unauthorized", async () => {
     //   const response = await request(app).get("/documents");
     //   expect(response.status).toBe(401);
     // });
   //});

  describe("GET /documents/:id", () => {
    // it("should return 401 when user is unauthorized", async () => {

    //   const response = await request(app).get("/documents");
    //   expect(response.status).toBe(401);
    // });

    it("should return 404 when document is not found", async () => {

      const response = await request(app).get("/documents/900");
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

//    describe("POST /documents", () => {
// //     // it("should return 401 when user is unauthorized", async () => {

// //     //   const response = await request(app).post("/documents").send({
// //     //     title: "Test Document",
// //     //     description: "This is a test document",
// //     //   });
// //     //   expect(response.status).toBe(401);
// //     // });

//      it("should return 400 when request is malformed", async () => {

//        const response = await request(app).post("/documents").send();
//        expect(response.status).toBe(400);
//      });
//    });

  describe("PATCH /documents/:id", () => {
    // it("should return 401 when user is unauthorized", async () => {

    //   const response = await request(app)
    //     .patch("/documents/1")
    //     .send({ title: "Updated Test Document" });
    //   expect(response.status).toBe(401);
    // });

    // it("should return 400 when request is malformed", async () => {

    //   const response = await request(app).patch("/documents/2").send();

    //   expect(response.status).toBe(400);
    // });

    it("should return 404 when document is not found", async () => {
      const response = await request(app)
        .patch("/documents/999")
        .send({ title: "Updated Test Document" });
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

   describe("DELETE /documents/:id", () => {
//     // it("should return 401 when user is unauthorized", async () => {

//     //   const response = await request(app).delete("/documents/1");
//     //   expect(response.status).toBe(401);
//     // });

     it("should return 404 when document is not found", async () => {

       const response = await request(app).delete("/documents/999");
       expect(response.status).toBe(StatusCodes.NOT_FOUND);
     });
   });
 });
