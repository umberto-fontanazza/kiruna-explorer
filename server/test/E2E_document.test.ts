import dotenv from "dotenv";
dotenv.config();
import app from "../src/app";
import request from "supertest";
import { Database } from "../src/database";
import { StatusCodes } from "http-status-codes";
import { DocumentType, Scale } from "../src/model/document";

// End to end testing, User story 1 and User story 3. 

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

    test("POST missing several mandatory fields", async () => {
        const response = await request(app).post("/documents/").send({
          title: "Title",
          coordinates: {latitude: 45, longitude: 30},
          language: "English"
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
  
describe("Testing story 1", () => {
    const testDocMandatoryFields = {
      title: "Mandatory Fields test",
      description: "This one will be tested for mandatory fields",
      scale: Scale.BlueprintsOrEffect,
      type: DocumentType.Prescriptive,
      language: "English",
    };
    const testDocAllFields = {
        title: "Coordinates test",
        description: "This one will be tested for all fields",
        scale: Scale.BlueprintsOrEffect,
        type: DocumentType.Informative,
        language: "English",
        coordinates: {latitude: 45, longitude: 30},
      };
    let testDocId: number;
  
    test("POST with All fields filled", async () => {
        const response = await request(app)
          .post("/documents/")
          .send({ ...testDocAllFields });
        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body.id).toBeDefined();
        expect(typeof response.body.id).toBe("number");
        testDocId = response.body.id;
      });
    
    // test("POST with only mandatory fields filled", async () => {
    //     const response = await request(app)
    //       .post("/documents/")
    //       .send({ ...testDocMandatoryFields });
    //     expect(response.status).toBe(StatusCodes.CREATED);
    //     expect(response.body.id).toBeDefined();
    //     expect(typeof response.body.id).toBe("number");
    //     testDocId = response.body.id;
    //   });
    
    test("PATCH all editable fields", async () => {
        const response = await request(app).patch(`/documents/${testDocId}`).send({
            title: "New title",
            description: "This one will be tested for all fields",
            type: DocumentType.Design,
            coordinates: {latitude:20, longitude: 40},
        });
        expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
    });

    test("PATCH just one field", async () => {
        const response = await request(app).patch(`/documents/${testDocId}`).send({
          description: "New shiny description",
        });
        expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
      });
    
    test("DELETE an existing document", async () => {
        const response = await request(app).del(`/documents/${testDocId}`);
        expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
      });

  });

describe("Testing with coordinates", () => {
    const testDoc = {
      title: "Coordinates test",
      description: "This one will be tested with coordinates",
      scale: Scale.BlueprintsOrEffect,
      type: DocumentType.Informative,
      language: "English",
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

